import type { Spec } from "../Spec.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export interface SystemMessage<S extends Spec = Spec> extends ActionBase<"SystemMessage", S> {
  content: string
}

export interface SystemMessageEvent extends EventBase<"SystemMessage"> {
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
