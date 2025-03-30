import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Context, Conversation, Generation, Model, SystemMessage } from "liminal"
import { AILanguageModel } from "liminal-ai"

Conversation(function*() {
  yield* Model("default")
  const classification = yield* Context("Classification", classifyQuery("I'd like a refund please"))
  const response = yield* Context("ClassificationConsumer", useClassification(classification))
  return { classification, response }
})
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
    reasoning: AILanguageModel(openai("o1-mini")),
  })
  .reduce(console.log)

function* classifyQuery(query: string) {
  yield* SystemMessage(`
    Classify this supplied customer query:

    Determine:

    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification
  `)
  yield query
  return yield* Generation(Classification)
}

const Classification = type({
  reasoning: "string",
  type: "'general' | 'refund' | 'technical'",
  complexity: "'simple' | 'complex'",
})

function* useClassification(classification: typeof Classification.infer) {
  yield* SystemMessage(USE_CLASSIFICATION_AGENT_PROMPTS[classification.type])
  if (classification.complexity === "complex") {
    yield* Model("reasoning")
  }
  return yield* Generation()
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
