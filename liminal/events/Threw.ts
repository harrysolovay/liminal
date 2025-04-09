import type { EventBase } from "./EventBase.ts"

export interface Threw extends EventBase<"threw"> {
  thrown: unknown
}
