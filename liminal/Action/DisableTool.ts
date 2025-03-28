import type { Tool } from "./Tool.js"
import type { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { Spec } from "../Spec.js"

export interface DisableTool<S extends Spec = Spec> extends ActionBase<"DisableTool", S> {
  tool: Tool
}

export interface DisableToolEvent<K extends string = string> extends EventBase<"DisableTool"> {
  key: K
}
