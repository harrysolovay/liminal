import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand.ts"

export const messages: Effect.Effect<Array<Message>, never, Strand> = Effect.map(
  Strand,
  ({ messages: [...messages] }) => messages,
)
