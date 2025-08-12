import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import type { Thread } from "../Thread.ts"
import { Self } from "./Self.ts"

/** Get a copy of the current list of messages. */
export const messages: Effect.Effect<Array<Message>, never, Thread> = Effect.map(
  Self,
  ({ state: { messages: [...messages] } }) => messages,
)
