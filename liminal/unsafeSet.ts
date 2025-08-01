import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand.ts"

/** Set the list of messages. */
export const unsafeSet: (
  messages: Iterable<Message>,
) => Effect.Effect<Array<Message>, never, Strand> = Effect.fnUntraced(function*(messages) {
  const strand = yield* Strand
  const previous = strand.messages
  Object.assign(strand, {
    messages: [...messages],
  })
  return previous
})
