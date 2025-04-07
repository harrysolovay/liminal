import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface ToolCalledEvent<K extends JSONKey = JSONKey, A = any> extends EventBase<"tool_called"> {
  args: A
  tool: K
}
