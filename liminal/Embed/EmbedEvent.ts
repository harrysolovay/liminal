import type { ActionEventBase } from "../Action/ActionEventBase.js"

export interface EmbeddedEvent extends ActionEventBase<"embedded"> {
  value: string
  embedding: Array<number>
}
