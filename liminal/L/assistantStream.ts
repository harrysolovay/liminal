import type { AiError } from "@effect/ai/AiError"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import type { AiResponse } from "@effect/ai/AiResponse"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Stream from "effect/Stream"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"
import { toolkit } from "./toolkit.ts"

/** Get a stream of an assistant message (does not append the message to the thread). */
export const assistantStream: Stream.Stream<AiResponse, AiError, AiLanguageModel | Thread> = Stream.unwrap(
  Effect.gen(function*() {
    const model = yield* AiLanguageModel
    const { state: { system, messages: prompt } } = yield* self
    return model.streamText({
      system: Option.getOrUndefined(system),
      prompt,
      toolkit,
    })
  }),
)
