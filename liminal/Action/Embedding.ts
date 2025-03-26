import type { JSONValue } from "../util/JSONValue.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { Spec } from "../Spec.js"

export function* Embedding<V extends JSONValue>(
  value: V,
): Generator<
  Embedding<{
    Model: never
    Event: EmbeddingEvent<V>
  }>,
  Array<number>
> {
  return yield ActionBase("Embedding", { value })
}

export interface Embedding<S extends Spec = Spec> extends ActionBase<"Embedding", S> {
  value: JSONValue
}

export interface EmbeddingEvent<V extends JSONValue = JSONValue> extends EventBase<"Embedding"> {
  value: V
  embedding: Array<number>
}
