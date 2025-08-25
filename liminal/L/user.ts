import { TextPart, UserMessage } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import type { Thread } from "../Thread.ts"
import type { ExtractE, ExtractR } from "../util/extract.ts"
import { normalize, type TaggableArg0, type TaggableArgRest } from "../util/Taggable.ts"
import { append } from "./append.ts"

/** Append a user message to the thread. */
export const user = <
  A0 extends TaggableArg0,
  ARest extends TaggableArgRest<A0>,
>(
  a0: A0,
  ...aRest: ARest
): Effect.Effect<
  void,
  ExtractE<A0 | ARest[number]>,
  ExtractR<A0 | ARest[number]> | Thread
> =>
  normalize(a0, ...aRest).pipe(
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
