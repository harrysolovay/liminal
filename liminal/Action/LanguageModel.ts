import type { Spec } from "../Spec.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* LanguageModel<K extends string>(
  key: K,
): Generator<
  LanguageModel<{
    LanguageModel: K
    EmbeddingModel: never
    Event: LanguageModelEvent<K>
  }>,
  void
> {
  return yield ActionBase("LanguageModel", { key })
}

export interface LanguageModel<S extends Spec = Spec> extends ActionBase<"LanguageModel", S> {
  key: string
}

export interface LanguageModelEvent<K extends string = string> extends EventBase<"LanguageModel"> {
  key: K
}
