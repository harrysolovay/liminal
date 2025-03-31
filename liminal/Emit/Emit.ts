import { ActionBase } from "../Action/ActionBase.js"
import type { JSONValue } from "../JSON/JSONValue.js"
import type { Spec } from "../Spec.js"
import type { EmittedEvent } from "./EmitEvent.js"

export interface Emit<S extends Spec = Spec> extends ActionBase<"emit", S> {
  key: keyof any
  value: JSONValue
}

export function* Emit<K extends keyof any, V extends JSONValue>(key: K, value: V): Generator<
  Emit<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EmittedEvent<K, V>
  }>,
  undefined
> {
  return yield ActionBase("emit", {
    key,
    value,
  })
}
