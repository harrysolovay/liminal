import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface ToolDisabledEvent<K extends keyof any = keyof any> extends ActionEventBase<"tool_disabled"> {
  tool: K
}
