import { TextPart, UserMessage } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { append } from "./append.ts"
import type { Thread } from "./ThreadInitial.ts"
import { normalize, type Taggable } from "./util/Taggable.ts"

/** Append a user message to the conversation. */
export const user: Taggable<void, never, Thread> = (a0, ...aRest) =>
  normalize(a0, aRest).pipe(
    Effect.flatMap((text) =>
      text
        ? append(
          UserMessage.make({
            parts: [
              TextPart.make({ text }),
            ],
          }),
        )
        : Effect.succeed(undefined)
    ),
  )
