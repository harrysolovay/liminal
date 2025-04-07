import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface EmbeddingModelSetEvent<K extends JSONKey = JSONKey> extends EventBase<"embedding_model_set"> {
  key: K
}
