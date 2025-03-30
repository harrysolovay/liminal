import type { EventBase } from "../Action/ActionEventBase.js"

export interface ToolRemovalEvent<K extends keyof any = keyof any> extends EventBase<"ToolRemoval"> {
  tool: K
}
