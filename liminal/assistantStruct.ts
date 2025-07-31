import * as AiError from "@effect/ai/AiError"
import * as AiInput from "@effect/ai/AiInput"
import * as AiLanguageModel from "@effect/ai/AiLanguageModel"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { append } from "./append.ts"
import * as Strand from "./Strand.ts"

/** Infer a structured assistant message and append its JSON representation to the conversation. */
export const assistantStruct: {
  <F extends Record<string, Schema.Schema.AnyNoContext>>(
    fields: F,
  ): Effect.Effect<
    { [K in keyof F]: Schema.Schema.Type<F[K]> },
    AiError.AiError,
    AiLanguageModel.AiLanguageModel | Strand.Strand
  >
  <O, I extends Record<string, unknown>>(
    schema: Schema.Schema<O, I, never>,
  ): Effect.Effect<O, AiError.AiError, AiLanguageModel.AiLanguageModel | Strand.Strand>
} = Effect.fnUntraced(
  function*(schema) {
    const model = yield* AiLanguageModel.AiLanguageModel
    const { system, messages } = yield* Strand.Strand
    const response = yield* model.generateObject({
      system,
      schema: (Schema.isSchema(schema) ? schema : Schema.Struct(schema)) as never as Schema.Schema.AnyNoContext,
      prompt: messages,
    })
    const { value, text } = response
    yield* append(
      new AiInput.AssistantMessage({
        parts: [new AiInput.TextPart({ text })],
      }),
    )
    return value
  },
)
