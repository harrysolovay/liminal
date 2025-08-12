import { TextPart, UserMessage } from "@effect/ai/AiInput"
import { expect, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import { messages } from "./messages.ts"
import { root } from "./root.ts"
import { user } from "./user.ts"

it.effect("test success", () =>
  Effect.gen(function*() {
    yield* user`A`
    yield* user("B")
    expect(yield* messages).toStrictEqual([
      UserMessage.make({
        parts: [
          TextPart.make({
            text: "A",
          }),
        ],
      }),
      UserMessage.make({
        parts: [
          TextPart.make({
            text: "B",
          }),
        ],
      }),
    ])
  }).pipe(
    root,
  ))
