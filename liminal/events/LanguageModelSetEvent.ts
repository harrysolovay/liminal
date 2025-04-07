import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface LanguageModelSetEvent<K extends JSONKey = JSONKey> extends EventBase<"language_model_set"> {
  key: K
}
