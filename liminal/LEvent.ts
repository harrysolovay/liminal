import { Message } from "@effect/ai/AiInput"
import * as Schema from "effect/Schema"

/** Event in which the thread's system is set to a new string. */
export class SystemSetEvent extends Schema.TaggedClass<SystemSetEvent>("SystemSetEvent")("system_set", {
  system: Schema.Option(Schema.String),
}) {}

/** Event in which one or more messages were added to the thread. */
export class MessagesAppendedEvent
  extends Schema.TaggedClass<MessagesAppendedEvent>("MessagesAppendedEvent")("messages_appended", {
    messages: Schema.Array(Message),
  })
{}

/** Event in which the thread is cleared of messages. */
export class MessagesClearedEvent
  extends Schema.TaggedClass<MessagesClearedEvent>("MessagesClearedEvent")("messages_cleared", {})
{}

export type LEvent = typeof LEvent["Type"]
export const LEvent: Schema.Union<[
  typeof SystemSetEvent,
  typeof MessagesAppendedEvent,
  typeof MessagesClearedEvent,
]> = Schema.Union(SystemSetEvent, MessagesAppendedEvent, MessagesClearedEvent)
