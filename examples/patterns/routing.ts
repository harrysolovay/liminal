import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Context, Exec, Inference, Model, System } from "liminal"
import { AILanguageModel } from "liminal-ai"

Exec(Main)
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
    reasoning: AILanguageModel(openai("o1-mini")),
  })
  .exec(console.log)

function* Main() {
  yield* Model.language("default")
  const classification = yield* Context("Classification", classifyQuery("I'd like a refund please"))
  const response = yield* Context("ClassificationConsumer", useClassification(classification))
  return { classification, response }
}

function* classifyQuery(query: string) {
  yield* System`
    Classify this supplied customer query:

    Determine:

    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification
  `
  yield query
  return yield* Inference(Classification)
}

const Classification = type({
  reasoning: "string",
  type: "'general' | 'refund' | 'technical'",
  complexity: "'simple' | 'complex'",
})

function* useClassification(classification: typeof Classification.infer) {
  yield* System(USE_CLASSIFICATION_AGENT_PROMPTS[classification.type])
  if (classification.complexity === "complex") {
    yield* Model.language("reasoning")
  }
  return yield* Inference()
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
