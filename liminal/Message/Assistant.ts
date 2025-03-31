import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.js"
import type { AssistantContent } from "./AssistantContent.js"
import type { AssistantMessagedEvent } from "./AssistantMessageEvent.js"

export interface AssistantMessage<S extends Spec = Spec> extends ActionBase<"assistant_message", S> {
  content: AssistantContent
}

export function* Assistant(
  ...[raw, ...substitutions]: [content: AssistantContent] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  AssistantMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: AssistantMessagedEvent
  }>,
  void
> {
  return yield ActionBase("assistant_message", {
    content: isTemplateStringsArray(raw) ? String.raw(raw, ...substitutions) : raw,
  })
}
