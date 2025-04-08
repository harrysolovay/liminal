import type { EventBase } from "./_EventBase.ts"

export interface Embedded extends EventBase<"embedded"> {
  value: string
  embedding: Array<number>
}
