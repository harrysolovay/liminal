import type { ChildScopeType } from "../Scope.ts"
import type { EventBase } from "./_EventBase.ts"
import type { LEvent } from "./LEvent.ts"

export interface PropagatedEvent<
  S extends ChildScopeType = ChildScopeType,
  K extends keyof any = keyof any,
  E extends LEvent = any,
> extends EventBase<"event_propagated"> {
  scopeType: S
  scope: K
  event: E
}
