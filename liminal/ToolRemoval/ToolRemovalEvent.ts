import type { ActionEventBase } from "../Action/ActionEventBase.js"

export interface ToolRemovalEvent<K extends keyof any = keyof any> extends ActionEventBase<"ToolRemoval"> {
  tool: K
}
