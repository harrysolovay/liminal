import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./_EventBase.ts"

export interface ToolEnabledEvent<K extends JSONKey = JSONKey> extends EventBase<"tool_enabled"> {
  key: K
  description: string
  schema: object
}
