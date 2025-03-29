import type { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { Tool } from "../Tool/Tool.js"

export interface ToolRemoval<S extends Spec = Spec> extends ActionBase<"DisableTool", S> {
  tool: Tool
}
