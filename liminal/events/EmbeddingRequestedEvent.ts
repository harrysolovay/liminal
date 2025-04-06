import type { EventBase } from "./_EventBase.ts"

export interface EmbeddingRequestedEvent extends EventBase<"embedding_requested"> {
  value: string
}
