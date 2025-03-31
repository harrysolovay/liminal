import type { ActionReducer } from "../Action/ActionReducer.js"
import type { ToolRemoval } from "../ToolRemoval/ToolRemoval.js"

export const reduceToolRemoval: ActionReducer<ToolRemoval> = (scope, action) => {
  scope.events.emit({
    type: "ToolRemoval",
    tool: action.tool.key,
  })
  const tools = new Set(scope.tools)
  tools.delete(action.tool)
  return scope.spread({
    tools,
    next: undefined,
  })
}
