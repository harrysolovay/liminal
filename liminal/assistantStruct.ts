import type { AiError } from "@effect/ai/AiError"
import { AssistantMessage, TextPart } from "@effect/ai/AiInput"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { append } from "./append.ts"
import { Strand } from "./Strand.ts"

/** Infer a structured assistant message and append its JSON representation to the conversation. */
export const assistantStruct: {
  <F extends Record<string, Schema.Schema.AnyNoContext>>(
    fields: F,
  ): Effect.Effect<{ [K in keyof F]: Schema.Schema.Type<F[K]> }, AiError, AiLanguageModel | Strand>
  <O, I extends Record<string, unknown>>(
    schema: Schema.Schema<O, I, never>,
  ): Effect.Effect<O, AiError, AiLanguageModel | Strand>
} = Effect.fnUntraced(
  function*(schema) {
    const model = yield* AiLanguageModel
    const { system, messages } = yield* Strand
    const { value, text } = yield* model.generateObject({
      system,
      schema: Schema.isSchema(schema) ? schema as Schema.Schema.AnyNoContext : Schema.Struct(schema),
      prompt: messages,
    })
    yield* append(
      new AssistantMessage({
        parts: [new TextPart({ text })],
      }),
    )
    return value
  },
)
