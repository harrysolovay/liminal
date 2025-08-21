import { Message } from "@effect/ai/AiInput"
import * as Schema from "effect/Schema"
import { ThreadName } from "./Thread.ts"

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

/** Event in which the thread name is changed. */
export class ThreadRenamedEvent extends Schema.TaggedClass<ThreadRenamedEvent>("ThreadRenamedEvent")("thread_renamed", {
  name: Schema.Option(ThreadName),
}) {}

/** Event in which the thread is cleared of messages. */
export class ThreadClearedEvent
  extends Schema.TaggedClass<ThreadClearedEvent>("MessagesClearedEvent")("messages_cleared", {})
{}

export type LEvent = typeof LEvent["Type"]
export const LEvent: Schema.Union<[
  typeof SystemSetEvent,
  typeof ThreadRenamedEvent,
  typeof MessagesAppendedEvent,
  typeof ThreadClearedEvent,
]> = Schema.Union(
  SystemSetEvent,
  ThreadRenamedEvent,
  MessagesAppendedEvent,
  ThreadClearedEvent,
)

export const encodeLEvent = Schema.encode(LEvent)
export const decodeLEvent = Schema.decode(LEvent)
