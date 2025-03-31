import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.js"
import type { AssistantContent } from "./AssistantContent.js"
import type { AssistantMessageEvent } from "./AssistantMessageEvent.js"

export interface AssistantMessage<S extends Spec = Spec> extends ActionBase<"AssistantMessage", S> {
  content: AssistantContent
}

export function* Assistant(
  ...[raw, ...substitutions]: [content: AssistantContent] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  AssistantMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: AssistantMessageEvent
  }>,
  void
> {
  return yield ActionBase("AssistantMessage", {
    content: isTemplateStringsArray(raw) ? String.raw(raw, ...substitutions) : raw,
  })
}
