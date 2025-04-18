import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./EventBase.ts"

export interface ToolDisabled<K extends JSONKey = JSONKey> extends EventBase<"tool_disabled"> {
  tool: K
}
