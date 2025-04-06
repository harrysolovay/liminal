import type { EventBase } from "./_EventBase.ts"

export interface AbortedEvent<E = any> extends EventBase<"aborted_event"> {
  reason: E
}
