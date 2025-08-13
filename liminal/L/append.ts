import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesAppended } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { Self } from "./Self.ts"

/** Append messages to the thread. */
export const append: (
  ...messages: Array<Message>
) => Effect.Effect<void, never, Thread> = Effect.fnUntraced(function*(...messages) {
  const { state, events } = yield* Self
  state.messages.push(...messages)
  yield* events.publish(MessagesAppended.make({ messages }))
})
