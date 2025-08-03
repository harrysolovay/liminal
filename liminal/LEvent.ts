import { Message } from "@effect/ai/AiInput"
import * as Schema from "effect/Schema"

export class Messages extends Schema.Array(Message) {}

/** An event in which one or more messages were added to the current strand's message list. */
export class MessagesAppended extends Schema.TaggedClass<MessagesAppended>("MessagesAppended")("MessagesAppended", {
  messages: Messages,
}) {}

/** An event in which a reducer was applied to the current strand's message list. */
export class MessagesReduced extends Schema.TaggedClass<MessagesReduced>("MessagesReduced")("MessagesReduced", {
  previous: Messages,
  messages: Messages,
}) {}

export type LEvent = typeof LEvent["Type"]
export const LEvent: Schema.Union<[
  typeof MessagesAppended,
  typeof MessagesReduced,
]> = Schema.Union(
  MessagesAppended,
  MessagesReduced,
)
