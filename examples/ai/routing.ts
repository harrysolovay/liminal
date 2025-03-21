import { Agent, AssistantText, AssistantObject, Model } from "liminal"
import { type } from "arktype"

export const Routing = Agent("", function* () {
  const query = prompt("Please enter your query?")!
  const classification = yield* ClassifyQueryAgent(query)("ClassifyQuery")
  const response = yield* UseClassificationAgent(classification)("UseClassification")
  return { classification, response }
})

function ClassifyQueryAgent(query: string) {
  return Agent(
    `
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `,
    function* () {
      yield query
      return yield* AssistantObject(Classification)
    },
  )
}

const Classification = type({
  reasoning: "string",
  type: "'general' | 'refund' | 'technical'",
  complexity: "'simple' | 'complex'",
})

function UseClassificationAgent(classification: typeof Classification.infer) {
  return Agent(USE_CLASSIFICATION_AGENT_PROMPTS[classification.type], function* () {
    if (classification.complexity === "complex") {
      yield* Model("reasoning")
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
