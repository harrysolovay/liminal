import type { EventBase } from "./_EventBase.ts"

export interface AbortedEvent<E = any> extends EventBase<"aborted"> {
  reason: E
}
