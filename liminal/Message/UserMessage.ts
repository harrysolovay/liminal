import type { Spec } from "../Spec.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { EventBase } from "../Action/ActionEventBase.js"
import type { FilePart, ImagePart, TextPart } from "./content_part.js"

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"UserMessage", S> {
  content: UserContent
}

export type UserContent = string | Array<TextPart | ImagePart | FilePart>

export interface UserMessageEvent extends EventBase<"UserMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: UserContent
}

export function* UserMessage(content: UserContent): Generator<
  UserMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: UserMessageEvent
  }>,
  void
> {
  return yield ActionBase("UserMessage", { content })
}
