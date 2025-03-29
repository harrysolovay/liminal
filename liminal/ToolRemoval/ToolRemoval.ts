import type { Tool } from "../Tool/Tool.js"
import type { ActionBase } from "../Action/ActionBase.js"
import type { EventBase } from "../Action/ActionEventBase.js"
import type { Spec } from "../Spec.js"

export interface ToolRemoval<S extends Spec = Spec> extends ActionBase<"DisableTool", S> {
  tool: Tool
}

export interface ToolRemovalEvent<K extends string = string> extends EventBase<"DisableTool"> {
  tool: K
}
