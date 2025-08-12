import type { AiError } from "@effect/ai/AiError"
import { AssistantMessage, TextPart } from "@effect/ai/AiInput"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import * as AiToolkit from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { Thread } from "../Thread.ts"
import { append } from "./append.ts"
import { Self } from "./Self.ts"

/** Infer an assistant message and append it to the conversation. */
export const assistant: Effect.Effect<string, AiError, AiLanguageModel | Thread> = Effect.gen(function*() {
  const model = yield* AiLanguageModel
  const { state, tools } = yield* Self
  let { text, results } = yield* model.generateText({
    system: Option.getOrUndefined(state.system),
    prompt: state.messages,
    toolkit: tools.pipe(
      Option.map((tools) => AiToolkit.make(...tools)),
      Option.getOrUndefined,
    ) as never,
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
