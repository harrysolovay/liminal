import type { EventBase } from "./EventBase.ts"

export interface Returned<T = any> extends EventBase<"returned"> {
  value: T
}
