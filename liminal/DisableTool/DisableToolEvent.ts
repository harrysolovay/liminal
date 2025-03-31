import type { ActionEventBase } from "../Action/ActionEventBase.js"

export interface ToolDisabledEvent<K extends keyof any = keyof any> extends ActionEventBase<"tool_disabled"> {
  tool: K
}
