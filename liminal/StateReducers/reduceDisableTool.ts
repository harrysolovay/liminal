import type { StateReducers } from "./StateReducers.js"

export const reduceDisableTool: StateReducers["reduceDisableTool"] = (state, action) => {
  state.events.emit({
    event: "DisableTool",
    tool: action.tool.key,
  })
  const tools = new Set([...state.tools])
  tools.delete(action.tool)
  return {
    ...state,
    tools,
    next: undefined,
  }
}
