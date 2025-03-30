import { ActionBase } from "../Action/ActionBase.js"
import type { JSONValue } from "../JSON/JSONValue.js"
import type { Spec } from "../Spec.js"
import type { EmissionEvent } from "./EmitEvent.js"

export interface Emission<S extends Spec = Spec> extends ActionBase<"Emission", S> {
  key: keyof any
  value: JSONValue
}

export function* Emission<K extends keyof any, V extends JSONValue>(
  key: K,
  value: V,
): Generator<
  Emission<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EmissionEvent<K, V>
  }>,
  undefined
> {
  return yield ActionBase("Emission", {
    key,
    value,
  })
}
