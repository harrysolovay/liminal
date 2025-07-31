import * as AiError from "@effect/ai/AiError"
import * as AiInput from "@effect/ai/AiInput"
import * as AiLanguageModel from "@effect/ai/AiLanguageModel"
import * as AiToolkit from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import { append } from "./append.ts"
import * as Strand from "./Strand.ts"

/** Infer an assistant message and append it to the conversation. */
export const assistant: Effect.Effect<
  string,
  AiError.AiError,
  AiLanguageModel.AiLanguageModel | Strand.Strand
> = Effect.gen(function*() {
  const model = yield* AiLanguageModel.AiLanguageModel
  const { system, messages, tools } = yield* Strand.Strand
  const response = yield* model.generateText({
    system,
    prompt: messages,
    toolkit: AiToolkit.make(...tools ?? []) as never,
  })
  const { text } = response
  yield* append(
    new AiInput.AssistantMessage({
      parts: [new AiInput.TextPart({ text })],
    }),
  )
  return text
})
