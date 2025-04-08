import { Action } from "../Action.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export function declareArg<K extends JSONKey>(key: K): <T>() => Generator<
  Action<"declare_arg", {
    Event: never
    Child: never
    Entry: [K, T]
    Throw: never
  }>,
  T
> {
  return function*() {
    return yield Action("declare_arg", (scope) => ({
      ...scope,
      nextArg: scope.args?.[key],
    }))
  }
}
