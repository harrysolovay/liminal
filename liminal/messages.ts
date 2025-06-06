import type { AiInput } from "@effect/ai"
import { Effect, Ref } from "effect"
import { MessagesRef } from "./Context.ts"

export const messages: Effect.Effect<Array<AiInput.Message>, never, MessagesRef> = Effect.flatMap(MessagesRef, Ref.get)
