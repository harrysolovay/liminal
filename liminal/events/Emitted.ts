import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

// TODO: make `value` an optional (prevent presence of `value: undefined` field when no second arg supplied to emit factory).
export interface Emitted<K extends JSONKey = JSONKey, E = any> extends EventBase<"emitted"> {
  key: K
  value: E
}
