import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import { MessagesRef } from "./Context.ts"

export const messages: Effect.Effect<Array<Message>, never, MessagesRef> = Effect.flatMap(MessagesRef, Ref.get)
