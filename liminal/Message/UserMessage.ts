import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { UserContent } from "./UserContent.js"
import type { UserMessageEvent } from "./UserMessageEvent.js"

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"UserMessage", S> {
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
