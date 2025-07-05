import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import { MessagesRef } from "./Context.ts"

export const set = Effect.fn(function*(messages: Iterable<Message>) {
  const messagesRef = yield* MessagesRef
  const previous = yield* Ref.get(messagesRef)
  yield* Ref.set(messagesRef, [...messages])
  return previous
})
