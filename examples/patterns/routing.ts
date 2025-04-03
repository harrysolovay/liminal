import { openai } from "@ai-sdk/openai"
import { exec, L } from "liminal"
import { AILanguageModel } from "liminal-ai"

exec(Main, {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
    reasoning: AILanguageModel(openai("o1-mini")),
  },
  handler: console.log,
})

function* Main() {
  yield* L.declareLanguageModel("default")
  const classification = yield* L.context("Classification", classifyQuery("I'd like a refund please"))
  const response = yield* L.context("ClassificationConsumer", useClassification(classification))
  return { classification, response }
}

function* classifyQuery(query: string) {
  yield* L.system`
    Classify this supplied customer query:

    Determine:

    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification
  `
  yield* L.user(query)
  return yield* Classification
}

const Classification = L.object({
  reasoning: L.string,
  type: L.enum("general", "refund", "technical"),
  complexity: L.enum("simple", "complex"),
})

function* useClassification(classification: typeof Classification["T"]) {
  yield* L.system(USE_CLASSIFICATION_AGENT_PROMPTS[classification.type])
  if (classification.complexity === "complex") {
    yield* L.declareLanguageModel("reasoning")
  }
  return yield* L.string
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
