import type { EventBase } from "./_EventBase.ts"

export interface EmbeddingRequested extends EventBase<"embedding_requested"> {
  value: string
}
