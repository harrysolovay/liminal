import type { ToolRemoval } from "../Action/DisableTool.js"
import type { ActionReducer } from "./ActionReducer.js"

export const reduceToolRemoval: ActionReducer<ToolRemoval> = (state, action) => {
  state.events.emit({
    event: "DisableTool",
    tool: action.tool.key,
  })
  const tools = new Set(state.tools)
  tools.delete(action.tool)
  return {
    ...state,
    tools,
    next: undefined,
  }
}
