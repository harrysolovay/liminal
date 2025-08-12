import type { AiError } from "@effect/ai/AiError"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import type { AiResponse } from "@effect/ai/AiResponse"
import * as AiToolkit from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Stream from "effect/Stream"
import { Thread } from "./ThreadInitial"

/** Get a streamed inference from the assistant without appending it to the strand's messages. */
export const assistantStream: Stream.Stream<
  AiResponse,
  AiError,
  AiLanguageModel | Thread
> = Stream.unwrap(
  Effect.gen(function*() {
    const model = yield* AiLanguageModel
    const { system, messages, tools } = yield* Thread
    return model.streamText({
      system: Option.getOrUndefined(system),
      prompt: messages,
      toolkit: AiToolkit.make(...tools),
    })
  }),
)
