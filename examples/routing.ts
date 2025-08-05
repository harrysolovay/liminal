import { OpenAiLanguageModel } from "@effect/ai-openai"
import { Console, Effect, Layer, Schema } from "effect"
import { L } from "liminal"
import { ClientLive, ModelLive } from "./_layers.ts"

const CLASSIFICATION_SYSTEM_PROMPTS = {
  general: "You are an expert customer service representative handling general inquiries.",
  refund:
    "You are a customer service representative specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}

Effect.gen(function*() {
  const classification = yield* L.strand(
    L.system`
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `,
    L.user`I'd like a refund please.`,
    L.assistantStruct({
      reasoning: Schema.String,
      type: Schema.Literal("general", "refund", "technical"),
      complex: Schema.Boolean,
    }),
  )

  const specialist = yield* L.strand(
    L.system(CLASSIFICATION_SYSTEM_PROMPTS[classification.type]),
    L.assistant,
  ).pipe(
    Effect.provide(
      classification.complex ? OpenAiLanguageModel.model("gpt-4o-mini") : Layer.empty,
    ),
  )

  yield* Console.log({ classification, specialist })
}).pipe(
  Effect.provide([ModelLive, ClientLive]),
  Effect.runFork,
)
