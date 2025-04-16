import type { LEventBase } from "./_LEventBase"
import type { LEvent } from "./LEvent"

export interface Propagated<K extends keyof any = keyof any, E extends LEvent = LEvent>
  extends LEventBase<"propagated">
{
  child: K
  event: E
}
