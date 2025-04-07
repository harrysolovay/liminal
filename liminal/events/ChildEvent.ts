import type { ChildScopeType } from "../Scope.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { LEvent } from "./LEvent.ts"
import type { PropagatedEvent } from "./PropagatedEvent.ts"
import type { ReturnedEvent } from "./ReturnedEvent.ts"

export type ChildEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends JSONKey = JSONKey,
  E extends LEvent = any,
  T = any,
> = PropagatedEvent<S, K, E | ReturnedEvent<T>>
