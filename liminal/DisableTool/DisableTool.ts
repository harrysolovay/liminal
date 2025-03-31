import type { ActionBase } from "../Action/ActionBase.js"
import type { EnableTool } from "../EnableTool/EnableTool.js"
import type { Spec } from "../Spec.js"

export interface DisableTool<S extends Spec = Spec> extends ActionBase<"disable_tool", S> {
  tool: EnableTool
}
