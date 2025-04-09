import type { EventBase } from "./EventBase.ts"

export interface Emitted<E = any> extends EventBase<"emitted"> {
  value: E
}
