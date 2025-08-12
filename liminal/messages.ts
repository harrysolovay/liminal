import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Self } from "./Self.ts"
import type { Thread } from "./Thread.ts"

/** Get a copy of the current list of messages. */
export const messages: Effect.Effect<Array<Message>, never, Thread> = Effect.map(
  Self,
  ({ state: { messages: [...messages] } }) => messages,
)
