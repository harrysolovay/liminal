import { TextPart, UserMessage } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import type { Thread } from "../Thread.ts"
import type { Taggable } from "../util/Taggable.ts"
import { append } from "./append.ts"
import { raw } from "./raw.ts"

/** Append a user message to the conversation. */
export const user: Taggable<void, never, Thread> = (a0, ...aRest) =>
  raw(a0, aRest).pipe(
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
