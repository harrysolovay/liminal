import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesCleared } from "./LEvent.ts"
import { Strand } from "./Strand.ts"

/** Clear the strand's conversation. */
export const clear: Effect.Effect<Array<Message>, never, Strand> = Effect.gen(function*() {
  const strand = yield* Strand
  const { messages, events } = strand
  strand.messages = []
  yield* events.publish(MessagesCleared.make({
    cleared: messages,
  }))
  return messages
})
