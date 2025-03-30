import { ActionBase } from "../Action/ActionBase.js"
import type { Scope } from "../Scope/Scope.js"

export interface CurrentScope extends ActionBase<"CurrentScope", never> {}

export function* CurrentScope(): Generator<CurrentScope, Scope> {
  return yield ActionBase("CurrentScope", {})
}
