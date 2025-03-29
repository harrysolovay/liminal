import type { EventBase } from "../Action/ActionEventBase.js"

export interface ToolRemovalEvent<K extends string = string> extends EventBase<"DisableTool"> {
  tool: K
}
