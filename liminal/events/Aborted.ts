import type { EventBase } from "./EventBase.ts"

export interface Aborted<E = any> extends EventBase<"aborted"> {
  reason: E
}
