import { Action } from "../Action.ts"
import type { Emitted } from "../events/Emitted.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export interface emit<K extends JSONKey, V extends JSONValue | undefined>
  extends Action<"emit", Spec.Make<{ Event: Emitted<K, V> }>>
{}

export function* emit<K extends JSONKey, V extends JSONValue | undefined = undefined>(
  key: K,
  value: V = undefined as never,
): Generator<emit<K, V>, undefined> {
  return yield Action("emit", (scope) => {
    scope.event({
      type: "emitted",
      key,
      value,
    })
    return {
      ...scope,
      nextArg: undefined,
    }
  })
}
