import type { ChildScopeType } from "../Scope.ts"
import type { LEvent } from "./LEvent.ts"
import type { PropagatedEvent } from "./PropagatedEvent.ts"
import type { ReturnedEvent } from "./ReturnedEvent.ts"

export type ChildEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends keyof any = keyof any,
  E extends LEvent = any,
  T = any,
> = PropagatedEvent<S, K, E | ReturnedEvent<T>>
