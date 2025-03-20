import { Agent, AssistantText, AssistantValue, Requirement } from "liminal"
import { type } from "arktype"

export function* HandleCustomerQuery(query: string) {
  const classification = yield* ClassifyQueryAgent(query)
  const response = yield* UseClassificationAgent(classification)
  return { classification, response }
}

const Classification = type({
  reasoning: "string",
  type: "'general' | 'refund' | 'technical'",
  complexity: "'simple' | 'complex'",
})

function ClassifyQueryAgent(query: string) {
  return Agent(
    "ClassifyQuery",
    `
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `,
    function* () {
      yield query
      return yield* AssistantValue(Classification)
    },
  )
}

function UseClassificationAgent(classification: typeof Classification.infer) {
  return Agent("UseClassification", USE_CLASSIFICATION_AGENT_PROMPTS[classification.type], function* () {
    if (classification.complexity === "complex") {
      yield* Requirement("reasoning")
    }
    return yield* AssistantText()
  })
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
