import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { EmbeddingEvent } from "./EmbeddingEvent.js"

export interface Embedding<S extends Spec = Spec> extends ActionBase<"Embedding", S> {
  value: string
}

export function* Embedding(value: string): Generator<
  Embedding<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EmbeddingEvent
  }>,
  Array<number>
> {
  return yield ActionBase("Embedding", { value })
}
