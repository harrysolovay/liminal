import { Action } from "../Action.ts"
import type { MakeSpec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export interface declareArg<K extends JSONKey, T> extends Action<"declare_arg", MakeSpec<{ Entry: [K, T] }>> {}

export function declareArg<K extends JSONKey>(key: K): <T>() => Generator<declareArg<K, T>, T> {
  return function*() {
    return yield Action("declare_arg", (scope) => ({
      ...scope,
      nextArg: scope.args?.[key],
    }))
  }
}
