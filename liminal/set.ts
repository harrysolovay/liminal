import type { AiInput } from "@effect/ai"
import { Effect, Ref } from "effect"
import { MessagesRef } from "./Context.ts"

export const set = Effect.fn(function*(messages: Iterable<AiInput.Message>) {
  const messagesRef = yield* MessagesRef
  const previous = yield* Ref.get(messagesRef)
  yield* Ref.set(messagesRef, [...messages])
  return previous
})
