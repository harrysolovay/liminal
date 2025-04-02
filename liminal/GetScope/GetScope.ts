import { ActionBase } from "../Action/ActionBase.ts"
import type { Scope } from "../Scope/Scope.ts"

export interface GetScope extends ActionBase<"get_scope", never> {}

export function* getScope(): Generator<GetScope, Scope> {
  return yield ActionBase("get_scope", {})
}
