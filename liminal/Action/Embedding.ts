import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./EventBase.js"
import type { Spec } from "../Spec.js"

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

export interface EmbeddingEvent extends EventBase<"Embedding"> {
  value: string
  embedding: Array<number>
}
