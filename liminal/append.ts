import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { Strand } from "./Conversation.ts"
import { MessagesAppended } from "./LEvent.ts"

/** Append messages to the current strand's message list. */
export const append: (
  ...messages: Array<Message>
) => Effect.Effect<void, never, Strand> = Effect.fnUntraced(function*(...messages) {
  const strand = yield* Strand
  strand.messages.push(...messages)
  yield* strand.events.publish(MessagesAppended.make({ messages }))
})
