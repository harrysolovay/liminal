import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand.ts"

/** Clear the list of messages. */
export const clear: Effect.Effect<Array<Message>, never, Strand> = Effect.map(Strand, (strand) => {
  const { messages } = strand
  strand.messages = []
  return messages
})
