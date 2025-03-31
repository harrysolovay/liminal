import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface EmbeddingRequestedEvent extends ActionEventBase<"embedding_requested"> {
  value: string
}

export interface EmbeddedEvent extends ActionEventBase<"embedded"> {
  value: string
  embedding: Array<number>
}
