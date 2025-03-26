import type { Spec } from "../Spec.js"
import type { JSONValue } from "../util/JSONValue.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* Emit<K extends string, V extends JSONValue>(
  key: K,
  value: V,
): Generator<
  Emit<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EmitEvent<K, V>
  }>,
  undefined
> {
  return yield ActionBase("Emit", { key, value })
}

export interface Emit<S extends Spec = Spec> extends ActionBase<"Emit", S> {
  key: string
  value: JSONValue
}

export interface EmitEvent<K extends string = string, E extends JSONValue = JSONValue> extends EventBase<"Emit"> {
  key: K
  value: E
}
