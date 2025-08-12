import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesCleared } from "./LEvent.ts"
import { type Thread, threadTag } from "./Thread.ts"

/** Clear the strand's conversation. */
export const clear: Effect.Effect<Array<Message>, never, Thread> = Effect.gen(function*() {
  const strand = yield* threadTag
  const { state, events } = strand
  const cleared = state.messages
  state.messages = []
  yield* events.publish(MessagesCleared.make({ cleared }))
  return cleared
})
