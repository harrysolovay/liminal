import type { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessagesAppended } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { Self } from "./Self.ts"

/** Append messages to the current strand's message list. */
export const append: (
  ...messages: Array<Message>
) => Effect.Effect<void, never, Thread> = Effect.fnUntraced(function*(...messages) {
  const strand = yield* Self
  strand.state.messages.push(...messages)
  yield* strand.events.publish(MessagesAppended.make({ messages }))
})
