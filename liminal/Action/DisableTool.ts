import type { Tool } from "./Tool.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* DisableTool<K extends string>(tool: Tool): Generator<DisableTool, void> {
  return yield ActionBase("DisableTool", { tool })
}

export interface DisableTool extends ActionBase<"DisableTool"> {
  tool: Tool
}

export interface DisableToolEvent<K extends string = string> extends EventBase<"DisableTool"> {
  key: K
}
