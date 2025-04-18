import type { LEventBase } from "./_LEventBase.ts"

export interface Resolved<T = any> extends LEventBase<"resolved"> {
  value: T
}
