import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesAppendedEvent } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"

/** Append messages to the thread. */
export const append: (
  ...messages: Array<Message>
) => Effect.Effect<void, never, Thread> = Effect.fnUntraced(function*(...messages) {
  const { state, events } = yield* self
  state.messages.push(...messages)
  yield* events.publish(MessagesAppendedEvent.make({ messages }))
})
