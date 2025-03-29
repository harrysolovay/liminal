import type { Spec } from "../Spec.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { SystemMessageEvent } from "./SystemMessageEvent.js"

export interface SystemMessage<S extends Spec = Spec> extends ActionBase<"SystemMessage", S> {
  content: string
}

export function* SystemMessage(content: string): Generator<
  SystemMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: SystemMessageEvent
  }>,
  void
> {
  return yield ActionBase("SystemMessage", { content })
}
