import type { EventBase } from "./_EventBase.ts"

export interface Threw extends EventBase<"threw"> {
  thrown: unknown
}
