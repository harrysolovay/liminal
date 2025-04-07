import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface ToolDisabledEvent<K extends JSONKey = JSONKey> extends EventBase<"tool_disabled"> {
  tool: K
}
