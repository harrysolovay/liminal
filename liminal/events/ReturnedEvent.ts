import type { EventBase } from "./_EventBase.ts"

export interface ReturnedEvent<T = any> extends EventBase<"returned"> {
  value: T
}
