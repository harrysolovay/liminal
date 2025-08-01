import { AiError } from "@effect/ai/AiError"
import { TextPart, UserMessage } from "@effect/ai/AiInput"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import * as Effect from "effect/Effect"
import { append } from "./append.ts"
import { assistant } from "./assistant.ts"
import { Strand } from "./Strand.ts"
import { normalize, type Taggable } from "./Taggable.ts"

/** Append a user message to the conversation, then infer and append an assistant message to the conversation. */
export const turn: Taggable<Effect.Effect<string, AiError, Strand | AiLanguageModel>> = Effect
  .fnUntraced(
    function*(a0, ...aRest) {
      yield* append(
        UserMessage.make({
          parts: [
            TextPart.make({
              text: normalize(a0, aRest),
            }),
          ],
        }),
      )
      return yield* assistant
    },
  )
