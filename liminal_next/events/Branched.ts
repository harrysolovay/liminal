import type { LEventBase } from "./_LEventBase.ts"

export interface Branched extends LEventBase<"branched"> {
  runic: number
  round: number
}
