import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface ToolCalled<K extends JSONKey = JSONKey, A = any> extends EventBase<"tool_called"> {
  tool: K
  args: A
}
