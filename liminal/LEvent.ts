import * as AiInput from "@effect/ai/AiInput"
import * as Schema from "effect/Schema"

export class MessageAppended extends Schema.TaggedClass<MessageAppended>("MessageAppended")("MessageAppended", {
  message: AiInput.Message,
}) {}

export class MessagesConcatenated
  extends Schema.TaggedClass<MessagesConcatenated>("MessagesConcatenated")("MessagesConcatenated", {
    messages: Schema.Array(AiInput.Message),
  })
{}

export class MessagesReduced extends Schema.TaggedClass<MessagesReduced>("MessagesReduced")("MessagesReduced", {
  previous: Schema.Array(AiInput.Message),
  messages: Schema.Array(AiInput.Message),
}) {}

export type LEvent = typeof LEvent.Type
export const LEvent: Schema.Union<[
  typeof MessageAppended,
  typeof MessagesConcatenated,
  typeof MessagesReduced,
]> = Schema.Union(
  MessageAppended,
  MessagesConcatenated,
  MessagesReduced,
)
