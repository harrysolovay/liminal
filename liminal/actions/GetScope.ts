import type { Scope } from "../Scope.ts"
import { ActionBase } from "./actions_base.ts"

export interface GetScope extends ActionBase<"get_scope", never> {}

export function* getScope(): Generator<GetScope, Scope> {
  return yield ActionBase("get_scope", {
    reduce(scope) {
      return scope.spread({ next: scope })
    },
  })
}
