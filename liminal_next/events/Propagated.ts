import type { LEvent } from "./LEvent"

export interface Propagated<S extends keyof any = keyof any, E extends LEvent = LEvent> {
  type: "propagated"
  scope: S
  event: E
}
