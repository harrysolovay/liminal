import type { Spec } from "../Spec.js"
import type { JSONValue } from "../JSON/JSONValue.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { EmitEvent } from "./EmitEvent.js"

export interface Emit<S extends Spec = Spec> extends ActionBase<"Emit", S> {
  key: string
  value: JSONValue
}

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
