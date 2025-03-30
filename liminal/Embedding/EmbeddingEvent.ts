import type { EventBase } from "../Action/ActionEventBase.js"

export interface EmbeddingEvent extends EventBase<"Embedding"> {
  value: string
  embedding: Array<number>
}
