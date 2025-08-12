import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Thread } from "./ThreadInitial.ts"

/** Get a copy of the current list of messages. */
export const messages: Effect.Effect<Array<Message>, never, Thread> = Effect.map(
  Thread,
  ({ messages: [...messages] }) => messages,
)
