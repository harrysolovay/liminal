import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import { MessagesRef } from "./Context.ts"
import { isTemplateStringsArray } from "./util/isTemplateStringsArray.ts"

export const user: {
  (
    template: TemplateStringsArray,
    ...substitutions: Array<unknown>
  ): Effect.Effect<void, never, MessagesRef>
  (message: string): Effect.Effect<void, never, MessagesRef>
} = Effect.fn(function*(e0, ...eRest) {
  const message = new AiInput.UserMessage({
    parts: [
      new AiInput.TextPart({
        text: isTemplateStringsArray(e0) ? String.raw({ raw: e0 }, ...eRest) : e0,
      }),
    ],
  })
  yield* Ref.update(yield* MessagesRef, (messages) => [...messages, message])
}) as never
