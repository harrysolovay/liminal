import { Action } from "../Action.ts"
import type { MakeSpec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export function declareArg<K extends JSONKey>(key: K): <T>() => Generator<
  Action<
    "declare_arg",
    MakeSpec<{
      Entry: [K, T]
    }>
  >,
  T
> {
  return function*() {
    return yield Action("declare_arg", (scope) => ({
      ...scope,
      nextArg: scope.args?.[key],
    }))
  }
}
