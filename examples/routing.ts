import { OpenAiLanguageModel } from "@effect/ai-openai"
import { Effect, Layer, Schema } from "effect"
import { L, Strand } from "liminal"
import { model } from "./_layers.ts"
import { logger } from "./_logger.ts"

const USE_CLASSIFICATION_PROMPTS = {
  general: "You are an expert customer service representative handling general inquiries.",
  refund:
    "You are a customer service representative specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}

Effect.gen(function*() {
  yield* logger

  const classification = yield* Effect.gen(function*() {
    yield* L.user`I'd like a refund please.`
    return yield* L.assistantStruct({
      reasoning: Schema.String,
      type: Schema.Literal("general", "refund", "technical"),
      complexity: Schema.Literal("simple", "complex"),
    })
  }).pipe(Effect.provide(
    Strand.new`
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `,
  ))
  const response = L.assistant.pipe(
    Effect.provide(
      Strand.new(USE_CLASSIFICATION_PROMPTS[classification.type]),
    ),
    classification.complexity === "complex"
      ? Effect.provide(OpenAiLanguageModel.model("gpt-4o-mini"))
      : Effect.provide(Layer.empty),
  )
  return { classification, response }
}).pipe(
  Effect.provide(Strand.new()),
  Effect.provide(model),
  Effect.runPromise,
)
