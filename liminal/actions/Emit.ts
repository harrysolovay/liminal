import type { Spec } from "../Spec.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"

export interface Emit<S extends Spec = Spec> extends ActionBase<"emit", S> {
  key: keyof any
  value: JSONValue
}

export function* emit<K extends keyof any, V extends JSONValue>(key: K, value: V): Generator<
  Emit<{
    Field: never
    Event: EmittedEvent<K, V>
  }>,
  undefined
> {
  return yield ActionBase("emit", {
    key,
    value,
    reduce(scope) {
      scope.events.emit({
        type: "emitted",
        key,
        value,
      })
      return scope.spread({
        next: undefined,
      })
    },
  })
}

export interface EmittedEvent<K extends keyof any = keyof any, E extends JSONValue = JSONValue>
  extends ActionEventBase<"emitted">
{
  key: K
  value: E
}
