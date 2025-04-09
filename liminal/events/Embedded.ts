import type { EventBase } from "./EventBase.ts"

export interface Embedded extends EventBase<"embedded"> {
  value: string
  embedding: Array<number>
}
