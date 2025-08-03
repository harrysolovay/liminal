import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand.ts"

/** Get a copy of the current list of messages. */
export const messages: Effect.Effect<Array<Message>, never, Strand> = Effect.map(
  Strand,
  ({ messages: [...messages] }) => messages,
)
