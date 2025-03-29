import type { EventBase } from "../Action/ActionEventBase.js"
import type { JSONValue } from "../JSON/JSONValue.js"

export interface EmitEvent<K extends string = string, E extends JSONValue = JSONValue> extends EventBase<"Emit"> {
  key: K
  value: E
}
