import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface ToolEnabled<K extends JSONKey = JSONKey> extends EventBase<"tool_enabled"> {
  tool: K
  description: string
  schema: object
}
