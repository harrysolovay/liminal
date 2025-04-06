import type { LEvent } from "../LEvent.ts"
import type { ChildScopeType } from "../Scope.ts"
import type { EventBase } from "./actions_base.ts"

export type ChildEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends keyof any = keyof any,
  E extends LEvent = any,
  T = any,
> = PropagatedEvent<S, K, EnteredEvent | E | ExitedEvent<T>>

export interface EnteredEvent extends EventBase<"entered"> {}

export interface PropagatedEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends keyof any = keyof any,
  E extends LEvent = any,
> extends EventBase<"event_propagated"> {
  scopeType: S
  scope: K
  event: E
}

export interface ExitedEvent<T = any> extends EventBase<"exited"> {
  value: T
}
