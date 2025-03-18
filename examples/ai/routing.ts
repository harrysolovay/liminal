import { Type, model, system } from "liminal"

export function* handleCustomerQuery(query: string) {
  yield `
    Classify this customer query:

    ${query}

    Determine:
    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification
  `
  const classification = yield* Type({
    reasoning: Type.string,
    type: Type.enum("general", "refund", "technical"),
    complexity: Type.enum("simple", "complex"),
  })
  yield* system(PROMPTS[classification.type])
  if (classification.complexity === "complex") {
    yield* model("reasoning")
  }
  yield query
  return {
    classification,
    response: yield* Type.string,
  }
}

const PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
