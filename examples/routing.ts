import { L } from "liminal"
import { gpt4oMini, o1Mini } from "./_models.ts"

const USE_CLASSIFICATION_PROMPTS = {
  general: "You are an expert customer service representative handling general inquiries.",
  refund:
    "You are a customer service representative specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}

await L.run(
  function*() {
    yield* L.model(gpt4oMini)
    const classification = yield* L.strand(
      function*() {
        yield* L.system`
          Classify this supplied customer query:

          Determine:

          1. Query type (general, refund, or technical)
          2. Complexity (simple or complex)
          3. Brief reasoning for classification
        `
        yield* L.user`I'd like a refund please.`
        return yield* L.assistant(L.object({
          reasoning: L.string,
          type: L.enum("general", "refund", "technical"),
          complexity: L.enum("simple", "complex"),
        }))
      },
    )
    const response = yield* L.strand(function*() {
      yield* L.system(USE_CLASSIFICATION_PROMPTS[classification.type])
      if (classification.complexity === "complex") {
        yield* L.model(o1Mini)
      }
      return yield* L.assistant
    })
    return { classification, response }
  },
  { handler: console.log },
)
