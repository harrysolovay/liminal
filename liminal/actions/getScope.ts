import { Action } from "../Action.ts"
import type { Scope } from "../Scope.ts"

export interface getScope extends Action<"get_scope", never> {}

export function* getScope(): Generator<getScope, Scope> {
  return yield Action("get_scope", (scope) => ({
    ...scope,
    nextArg: scope,
  }))
}
