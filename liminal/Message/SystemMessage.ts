import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.js"
import type { SystemMessageEvent } from "./SystemMessageEvent.js"

export interface SystemMessage<S extends Spec = Spec> extends ActionBase<"SystemMessage", S> {
  content: string
}

export function* System(
  ...[raw, ...substitutions]: [content: string] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  SystemMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: SystemMessageEvent
  }>,
  void
> {
  return yield ActionBase("SystemMessage", {
    content: isTemplateStringsArray(raw) ? String.raw(raw, ...substitutions) : raw,
  })
}
