import type { StateReducers } from "./StateReducers.js"

export const reduceDisableTool: StateReducers["reduceDisableTool"] = (state, action) => {
  state.handler({
    event: "DisableTool",
    key: action.tool.key,
  })
  const tools = new Set([...state.tools])
  tools.delete(action.tool)
  return {
    ...state,
    tools,
    next: undefined,
  }
}
