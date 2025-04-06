import type { EventBase } from "./_EventBase.ts"

export interface EmbeddedEvent extends EventBase<"embedded"> {
  value: string
  embedding: Array<number>
}
