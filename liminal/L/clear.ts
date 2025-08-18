import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesClearedEvent } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { Self } from "./Self.ts"

/** Clear the thread of messages. */
export const clear: Effect.Effect<Array<Message>, never, Thread> = Effect.gen(function*() {
  const { state, events } = yield* Self
  const cleared = state.messages
  state.messages = []
  yield* events.publish(MessagesClearedEvent.make({ cleared }))
  return cleared
})
