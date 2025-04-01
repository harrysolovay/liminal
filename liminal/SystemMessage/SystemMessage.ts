import { ActionBase } from "../Action/ActionBase.ts"
import type { Spec } from "../Spec.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import type { SystemMessagedEvent } from "./SystemMessageEvent.ts"

export interface SystemMessage<S extends Spec = Spec> extends ActionBase<"system_message", S> {
  content: string
}

export function* system(
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
