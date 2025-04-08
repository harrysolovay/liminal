import type { EventBase } from "./_EventBase.ts"

export interface Returned<T = any> extends EventBase<"returned"> {
  value: T
}
