import { TextPart, UserMessage } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { append } from "./append.ts"
import * as Strand from "./Strand.ts"
import { normalize, type Taggable } from "./Taggable.ts"

/** Append a user message to the conversation. */
export const user: Taggable<Effect.Effect<void, never, Strand.Strand>> = (a0, ...aRest) =>
  append(
    UserMessage.make({
      parts: [
        TextPart.make({
          text: normalize(a0, aRest),
        }),
      ],
    }),
  )
