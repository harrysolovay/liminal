import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface EmittedEvent<K extends JSONKey = JSONKey, E = any> extends EventBase<"emitted"> {
  key: K
  value: E
}
