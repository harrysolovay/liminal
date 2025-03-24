import type { ActionReducers } from "./ActionReducers.js"

export const reduceDisableTool: ActionReducers["reduceDisableTool"] = (state, action) => {
  state.handler({
    type: "DisableTool",
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
