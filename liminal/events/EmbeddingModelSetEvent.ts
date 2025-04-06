import type { EventBase } from "./_EventBase.ts"

export interface EmbeddingModelSetEvent<K extends keyof any = keyof any> extends EventBase<"embedding_model_set"> {
  key: K
}
