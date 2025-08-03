import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Conversation.ts"

/** Clear the strand's conversation. */
export const clear: Effect.Effect<Array<Message>, never, Strand> = Effect.map(Strand, (strand) => {
  const { messages } = strand
  strand.messages = []
  return messages
})
