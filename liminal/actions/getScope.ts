import { Action } from "../Action.ts"
import type { Scope } from "../Scope.ts"

export function* getScope(): Generator<
  Action<"get_scope", {
    Event: never
    Child: never
    Entry: never
    Throw: never
  }>,
  Scope
> {
  return yield Action("get_scope", (scope) => ({
    ...scope,
    nextArg: scope,
  }))
}
