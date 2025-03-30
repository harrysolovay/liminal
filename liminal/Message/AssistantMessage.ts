import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { AssistantContent } from "./AssistantContent.js"
import type { AssistantMessageEvent } from "./AssistantMessageEvent.js"

export interface AssistantMessage<S extends Spec = Spec> extends ActionBase<"AssistantMessage", S> {
  content: AssistantContent
}

export function* AssistantMessage(content: AssistantContent): Generator<
  AssistantMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: AssistantMessageEvent
  }>,
  void
> {
  return yield ActionBase("AssistantMessage", { content })
}
