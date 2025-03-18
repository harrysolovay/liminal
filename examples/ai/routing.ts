import { model, system } from "liminal"
import { from } from "liminal-arktype"
import { type } from "arktype"

export function* handleCustomerQuery(query: string) {
  yield `
    Classify this customer query:

    ${query}

    Determine:
    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification
  `
  const classification = yield* from(
    type({
      reasoning: "string",
      type: "'general' | 'refund' | 'technical'",
      complexity: "'simple' | 'complex'",
    }),
  )
  yield* system(PROMPTS[classification.type])
  if (classification.complexity === "complex") {
    yield* model("reasoning")
  }
  yield query
  return {
    classification,
    response: yield* from(type.string),
  }
}

const PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
