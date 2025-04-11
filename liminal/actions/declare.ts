import { Action } from "../Action.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export interface declare<K extends JSONKey, T> extends Action<"declare", Spec.Make<{ Entry: [K, T] }>> {}

export function declare<K extends JSONKey>(key: K): <T>() => Generator<declare<K, T>, T> {
  return function*() {
    return yield Action("declare", (scope) => ({
      ...scope,
      nextArg: scope.args?.[key],
    }))
  }
}
