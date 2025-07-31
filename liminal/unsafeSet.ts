import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand.ts"

/** Set the list of messages. */
export const set: (
  messages: Iterable<AiInput.Message>,
) => Effect.Effect<Array<AiInput.Message>, never, Strand> = Effect.fnUntraced(function*(messages) {
  const strand = yield* Strand
  const previous = strand.messages
  Object.assign(strand, {
    messages: [...messages],
  })
  return previous
})
