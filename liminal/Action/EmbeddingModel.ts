import type { Spec } from "../Spec.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* EmbeddingModel<K extends string>(
  key: K,
): Generator<
  EmbeddingModel<{
    Model: {
      language: never
      embedding: K
    }
    Event: EmbeddingModelEvent<K>
  }>,
  void
> {
  return yield ActionBase("EmbeddingModel", { key })
}

export interface EmbeddingModel<S extends Spec = Spec> extends ActionBase<"EmbeddingModel", S> {
  key: string
}

export interface EmbeddingModelEvent<K extends string = string> extends EventBase<"EmbeddingModel"> {
  key: K
}
