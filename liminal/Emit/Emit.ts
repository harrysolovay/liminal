import { ActionBase } from "../Action/ActionBase.ts"
import type { JSONValue } from "../JSON/JSONValue.ts"
import type { Spec } from "../Spec.ts"
import type { EmittedEvent } from "./EmitEvent.ts"

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
