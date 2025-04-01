import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { DisableTool } from "./DisableTool.ts"

export const reduceDisableTool: ActionReducer<DisableTool> = (action, scope) => {
  scope.events.emit({
    type: "tool_disabled",
    tool: action.tool.key,
  })
  const tools = new Set(scope.tools)
  tools.delete(action.tool)
  return scope.spread({
    tools,
    next: undefined,
  })
}
