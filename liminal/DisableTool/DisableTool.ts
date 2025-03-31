import type { ActionBase } from "../Action/ActionBase.ts"
import type { EnableTool } from "../EnableTool/EnableTool.ts"
import type { Spec } from "../Spec.ts"

export interface DisableTool<S extends Spec = Spec> extends ActionBase<"disable_tool", S> {
  tool: EnableTool
}
