import type { EventBase } from "../Action.ts"
import type { LEvent } from "../LEvent.ts"
import type { ChildScopeType } from "../Scope.ts"

export type ChildEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends keyof any = keyof any,
  E extends LEvent = any,
  T = any,
> = PropagatedEvent<S, K, E | ReturnedEvent<T>>

export interface PropagatedEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends keyof any = keyof any,
  E extends LEvent = any,
> extends EventBase<"event_propagated"> {
  scopeType: S
  scope: K
  event: E
}

export interface ReturnedEvent<T = any> extends EventBase<"returned"> {
  value: T
}
