import { Action } from "../Action.ts"
import type { Emitted } from "../events/Emitted.ts"
import type { MakeSpec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export function* emit<K extends JSONKey, V extends JSONValue | undefined = undefined>(
  key: K,
  value: V = undefined as never,
): Generator<
  Action<
    "emit",
    MakeSpec<{
      Event: Emitted<K, V>
    }>
  >,
  undefined
> {
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
