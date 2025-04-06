import type { EventBase } from "./_EventBase.ts"

export interface ToolDisabledEvent<K extends keyof any = keyof any> extends EventBase<"tool_disabled"> {
  tool: K
}
