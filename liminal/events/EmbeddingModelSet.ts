import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./EventBase.ts"

export interface EmbeddingModelSet<K extends JSONKey = JSONKey> extends EventBase<"embedding_model_set"> {
  modelKey: K
}
