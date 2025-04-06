import { Action } from "../Action.ts"

export function arg<K extends keyof any>(key: K): <T>() => Generator<
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
