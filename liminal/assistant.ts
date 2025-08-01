import type { AiError } from "@effect/ai/AiError"
import { AssistantMessage, TextPart } from "@effect/ai/AiInput"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import * as AiToolkit from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import { append } from "./append.ts"
import { Strand } from "./Strand.ts"

/** Infer an assistant message and append it to the conversation. */
export const assistant: Effect.Effect<string, AiError, AiLanguageModel | Strand> = Effect.gen(function*() {
  const model = yield* AiLanguageModel
  const { system, messages, tools } = yield* Strand
  const { text } = yield* model.generateText({
    system,
    prompt: messages,
    toolkit: AiToolkit.make(...tools ?? []) as never,
  })
  yield* append(
    new AssistantMessage({
      parts: [new TextPart({ text })],
    }),
  )
  return text
})
