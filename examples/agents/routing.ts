import { L } from "liminal"

const QUERY = "I'd like a refund please."

export default function*() {
  const classification = yield* L.branch("classify", function*() {
    yield* L.clear()
    yield* L.system`
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `
    yield* L.user(QUERY)
    return yield* L.object({
      reasoning: L.string,
      type: L.enum("general", "refund", "technical"),
      complexity: L.enum("simple", "complex"),
    })
  })
  const response = yield* L.branch("handle", function*() {
    yield* L.clear()
    yield* L.system(USE_CLASSIFICATION_AGENT_PROMPTS[classification.type])
    if (classification.complexity === "complex") {
      yield* L.declareModel("reasoning")
    }
    return yield* L.infer
  })
  return { classification, response }
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
