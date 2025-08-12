import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesCleared } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { Self } from "./Self.ts"

/** Clear the strand's conversation. */
export const clear: Effect.Effect<Array<Message>, never, Thread> = Effect.gen(function*() {
  const strand = yield* Self
  const { state, events } = strand
  const cleared = state.messages
  state.messages = []
  yield* events.publish(MessagesCleared.make({ cleared }))
  return cleared
})
