import { Message } from "@effect/ai/AiInput"
import * as Schema from "effect/Schema"

export class MessagesAppended extends Schema.TaggedClass<MessagesAppended>("MessagesAppended")("MessagesAppended", {
  messages: Schema.Array(Message),
}) {}

export class MessagesReduced extends Schema.TaggedClass<MessagesReduced>("MessagesReduced")("MessagesReduced", {
  previous: Schema.Array(Message),
  messages: Schema.Array(Message),
}) {}

export type LEvent = typeof LEvent.Type
export const LEvent: Schema.Union<[
  typeof MessagesAppended,
  typeof MessagesReduced,
]> = Schema.Union(MessagesAppended, MessagesReduced)
