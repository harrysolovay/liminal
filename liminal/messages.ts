import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand.ts"

/** Message list underlying the current strand. */
export const messages: Effect.Effect<Array<AiInput.Message>, never, Strand> = Effect.map(
  Strand,
  ({ messages }) => messages,
)
