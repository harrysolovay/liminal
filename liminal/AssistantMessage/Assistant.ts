import { ActionBase } from "../Action/ActionBase.ts"
import type { Spec } from "../Spec.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import type { AssistantContent } from "./AssistantContent.ts"
import type { AssistantMessagedEvent } from "./AssistantMessageEvent.ts"

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
