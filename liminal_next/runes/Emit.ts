import type { RuneBase } from "./_RuneBase.ts"

export interface Emit<K extends keyof any = keyof any, V = any> extends RuneBase<"emit"> {
  key: K
  value: V
}
