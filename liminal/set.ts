import type { AiInput } from "@effect/ai"
import { Effect, Ref } from "effect"
import { MessagesRef } from "./Context.ts"

export const set = (messages: Iterable<AiInput.Message>) =>
  Effect
    .gen(function*() {
      const messagesRef = yield* MessagesRef
      return yield* Ref.get(messagesRef)
    })
    .pipe(Effect.provideService(MessagesRef, Ref.unsafeMake([...messages])))
