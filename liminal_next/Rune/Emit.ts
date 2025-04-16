import type { Emitted } from "../LEvent/Emitted.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Emit<K extends keyof any = keyof any, V = any> extends RuneBase<"emit", Emitted<K, V>> {
  key: K
  value: V
}
