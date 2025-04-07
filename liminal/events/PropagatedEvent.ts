import type { ChildScopeType } from "../Scope.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"
import type { LEvent } from "./LEvent.ts"

export interface PropagatedEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends JSONKey = JSONKey,
  E extends LEvent = any,
> extends EventBase<"propagated"> {
  scopeType: S
  scope: K
  event: E
}
