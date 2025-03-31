import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface EmbeddedEvent extends ActionEventBase<"embedded"> {
  value: string
  embedding: Array<number>
}
