import { Message } from "@effect/ai/AiInput"
import * as Schema from "effect/Schema"

export class Messages extends Schema.Array(Message) {}

/** An event in which one or more messages were added to the thread. */
export class MessagesAppended extends Schema.TaggedClass<MessagesAppended>("MessagesAppended")("MessagesAppended", {
  messages: Messages,
}) {}

/** An event in which the thread is cleared of messages. */
export class MessagesCleared extends Schema.TaggedClass<MessagesCleared>("MessagesCleared")("MessagesCleared", {
  cleared: Messages,
}) {}

export type LEvent = typeof LEvent["Type"]
export const LEvent: Schema.Union<[
  typeof MessagesAppended,
  typeof MessagesCleared,
]> = Schema.Union(
  MessagesAppended,
  MessagesCleared,
)
