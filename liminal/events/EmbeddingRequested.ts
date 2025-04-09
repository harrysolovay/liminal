import type { EventBase } from "./EventBase.ts"

export interface EmbeddingRequested extends EventBase<"embedding_requested"> {
  value: string
}
