import type { Tool } from "./Tool.js"
import type { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./EventBase.js"
import type { Spec } from "../Spec.js"

export interface ToolRemoval<S extends Spec = Spec> extends ActionBase<"DisableTool", S> {
  tool: Tool
}

export interface ToolRemovalEvent<K extends string = string> extends EventBase<"DisableTool"> {
  tool: K
}
