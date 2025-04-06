import type { EventBase } from "./_EventBase.ts"

export interface ThrownEvent extends EventBase<"thrown"> {
  thrown: unknown
}
