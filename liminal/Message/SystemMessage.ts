import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.js"
import type { SystemMessagedEvent } from "./SystemMessageEvent.js"

export interface SystemMessage<S extends Spec = Spec> extends ActionBase<"system_message", S> {
  content: string
}

export function* System(
  ...[raw, ...substitutions]: [content: string] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  SystemMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: SystemMessagedEvent
  }>,
  void
> {
  return yield ActionBase("system_message", {
    content: isTemplateStringsArray(raw) ? String.raw(raw, ...substitutions) : raw,
  })
}
