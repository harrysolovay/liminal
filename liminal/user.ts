import { AiInput } from "@effect/ai"
import { Effect, Ref } from "effect"
import { _emit } from "./_emit.ts"
import { Handler, MessagesRef } from "./Context.ts"
import { MessageAppended } from "./LEvent.ts"
import { isTemplateStringsArray } from "./util/isTemplateStringsArray.ts"

export const user: {
  (
    template: TemplateStringsArray,
    ...substitutions: Array<unknown>
  ): Effect.Effect<void, never, MessagesRef | Handler>
  (message: string): Effect.Effect<void, never, MessagesRef | Handler>
} = (e0, ...eRest) =>
  Effect.gen(function*() {
    const message = new AiInput.UserMessage({
      parts: [
        new AiInput.TextPart({
          text: isTemplateStringsArray(e0) ? String.raw({ raw: e0 }, ...eRest) : e0,
        }),
      ],
    })
    yield* _emit(new MessageAppended({ message }))
    yield* Ref.update(yield* MessagesRef, (messages) => [...messages, message])
  })
