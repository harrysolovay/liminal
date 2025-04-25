import { type } from "arktype"
import "liminal-arktype/register"
import { Agent, L } from "liminal"
import models from "./models.ts"

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}

await Agent(
  function*() {
    yield* L.model(models.gpt4oMini)
    const classification = yield* L.branch(function*() {
      yield* L.system`
        Classify this supplied customer query:

        Determine:

        1. Query type (general, refund, or technical)
        2. Complexity (simple or complex)
        3. Brief reasoning for classification
      `
      yield* L.user`I'd like a refund please.`
      return yield* L.assistant(type({
        reasoning: "string",
        type: "'general' | 'refund' | 'technical'",
        complexity: "'simple' | 'complex'",
      }))
    })
    const response = yield* L.branch(function*() {
      yield* L.system(USE_CLASSIFICATION_AGENT_PROMPTS[classification.type])
      if (classification.complexity === "complex") {
        yield* L.model(models.o1Mini)
      }
      return yield* L.assistant
    })
    return { classification, response }
  },
  { handler: console.log },
)
