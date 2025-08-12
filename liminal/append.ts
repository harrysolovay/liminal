import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesAppended } from "./LEvent.ts"
import { Thread } from "./ThreadInitial.ts"

/** Append messages to the current strand's message list. */
export const append: (
  ...messages: Array<Message>
) => Effect.Effect<void, never, Thread> = Effect.fnUntraced(function*(...messages) {
  const strand = yield* Thread
  strand.messages.push(...messages)
  yield* strand.events.publish(MessagesAppended.make({ messages }))
})
