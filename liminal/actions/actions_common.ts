import type { ActionEvent } from "../ActionEvent.ts"
import type { ScopeSource } from "../Scope.ts"
import type { ActionEventBase } from "./actions_base.ts"

export interface EnteredEvent extends ActionEventBase<"entered"> {}

export interface ChildEvent<
  S extends ScopeSource = ScopeSource,
  K extends keyof any = keyof any,
  E extends ActionEvent = any,
> extends ActionEventBase<"child"> {
  scopeType: S
  scope: K
  event: E
}

export interface ExitedEvent<T = any> extends ActionEventBase<"exited"> {
  result: T
}
