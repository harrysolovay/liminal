import type { AiError } from "@effect/ai/AiError"
import { AssistantMessage, TextPart } from "@effect/ai/AiInput"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { Thread } from "../Thread.ts"
import { append } from "./append.ts"
import { self } from "./self.ts"
import { toolkit } from "./toolkit.ts"

/** Infer an assistant message and append it to the thread. */
export const assistant: Effect.Effect<string, AiError, AiLanguageModel | Thread> = Effect.gen(function*() {
  const model = yield* AiLanguageModel
  const { state: { system, messages: prompt } } = yield* self
  let { text, results } = yield* model.generateText({
    system: Option.getOrUndefined(system),
    prompt,
    toolkit,
  })
  // TODO: this shouldn't be necessary. Bug in Effect AI?
  if (!text.trim()) {
    text = results.values().next().value?.result as never as string
  }
  yield* append(
    AssistantMessage.make({
      parts: [TextPart.make({ text })],
    }),
  )
  return text
})
