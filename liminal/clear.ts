import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesCleared } from "./LEvent.ts"
import { Thread } from "./ThreadInitial.ts"

/** Clear the strand's conversation. */
export const clear: Effect.Effect<Array<Message>, never, Thread> = Effect.gen(function*() {
  const strand = yield* Thread
  const { messages, events } = strand
  strand.messages = []
  yield* events.publish(MessagesCleared.make({
    cleared: messages,
  }))
  return messages
})
