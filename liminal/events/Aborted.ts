import type { EventBase } from "./_EventBase.ts"

export interface Aborted<E = any> extends EventBase<"aborted"> {
  reason: E
}
