import { Action } from "../Action.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export function arg<K extends JSONKey>(key: K): <T>() => Generator<
  Action<"arg", {
    Entry: [K, T]
    Event: never
    Throw: never
  }>,
  T
> {
  return function*() {
    return yield Action("arg", (scope) => ({
      ...scope,
      nextArg: scope.args[key],
    }))
  }
}
