import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./EventBase.ts"

export interface LanguageModelSet<K extends JSONKey = JSONKey> extends EventBase<"language_model_set"> {
  modelKey: K
}
