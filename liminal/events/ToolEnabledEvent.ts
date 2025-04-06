import type { EventBase } from "./_EventBase.ts"

export interface ToolEnabledEvent<K extends keyof any = keyof any> extends EventBase<"tool_enabled"> {
  key: K
  description: string
  schema: object
}
