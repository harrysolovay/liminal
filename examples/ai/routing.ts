import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Context, Generation, Model } from "liminal"
import { AILanguageModel } from "liminal-ai"

Root().exec({
  models: {
    language: {
      default: AILanguageModel(openai("gpt-4o-mini")),
      reasoning: AILanguageModel(openai("o1-mini")),
    },
  },
  handler: console.log,
})

function Root() {
  return Context("root", function*() {
    yield* Model("default")
    const classification = yield* classifyQuery("I'd like a refund please")
    const response = yield* useClassification(classification)
    return { classification, response }
  })
}

function classifyQuery(query: string) {
  return Context(
    "ClassifyQueryAgent",
    `
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `,
    function*() {
      yield query
      return yield* Generation(Classification)
    },
  )
}

const Classification = type({
  reasoning: "string",
  type: "'general' | 'refund' | 'technical'",
  complexity: "'simple' | 'complex'",
})

function useClassification(classification: typeof Classification.infer) {
  return Context("UseClassificationAgent", USE_CLASSIFICATION_AGENT_PROMPTS[classification.type], function*() {
    if (classification.complexity === "complex") {
      yield* Model("reasoning")
    }
    return yield* Generation()
  })
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
