import type { ActionReducer } from "../Action/ActionReducer.js"
import type { ToolRemoval } from "../ToolRemoval/ToolRemoval.js"

export const reduceToolRemoval: ActionReducer<ToolRemoval> = (state, action) => {
  state.events.emit({
    event: "DisableTool",
    tool: action.tool.key,
  })
  const tools = new Set(state.tools)
  tools.delete(action.tool)
  return state.spread({
    tools,
    next: undefined,
  })
}
