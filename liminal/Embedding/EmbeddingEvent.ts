import type { ActionEventBase } from "../Action/ActionEventBase.js"

export interface EmbeddingEvent extends ActionEventBase<"Embedding"> {
  value: string
  embedding: Array<number>
}
