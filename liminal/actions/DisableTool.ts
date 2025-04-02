import type { Spec } from "../Spec.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { EnableTool } from "./EnableTool.ts"

export interface DisableTool<S extends Spec = Spec> extends ActionBase<"disable_tool", S> {
  enableTool: EnableTool
}

export function* disableTool(enableTool: EnableTool): Generator<DisableTool, void> {
  yield ActionBase("disable_tool", {
    enableTool,
    reduce(scope) {
      scope.events.emit({
        type: "tool_disabled",
        tool: enableTool.key,
      })
      const tools = new Set(scope.tools)
      tools.delete(enableTool)
      return scope.spread({
        tools,
        next: undefined,
      })
    },
  })
}

export interface ToolDisabledEvent<K extends keyof any = keyof any> extends ActionEventBase<"tool_disabled"> {
  tool: K
}
