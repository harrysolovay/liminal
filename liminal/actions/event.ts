import { Action } from "../Action.ts"
import type { Emitted } from "../events/Emitted.ts"
import type { Spec } from "../Spec.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export interface event<V extends JSONValue> extends Action<"emit", Spec.Make<{ Event: Emitted<V> }>> {}

export function* event<V extends JSONValue = never>(
  value: V = undefined as never,
): Generator<event<V>, void> {
  return yield Action("emit", (scope) => {
    scope.event({
      type: "emitted",
      value,
    })
    return {
      ...scope,
      nextArg: undefined,
    }
  }) as never
}
