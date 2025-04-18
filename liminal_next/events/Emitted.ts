import type { LEventBase } from "./_LEventBase.ts"

export interface Emitted<K extends keyof any = keyof any, V = any> extends LEventBase<"emitted"> {
  key: K
  value: V
}
