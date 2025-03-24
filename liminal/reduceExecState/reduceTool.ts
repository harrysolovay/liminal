import type { ActionReducers } from "./ActionReducers.js"

export const reduceTool: ActionReducers["reduceTool"] = (state, action) => {
  state.handler({
    type: "EnableTool",
    key: action.key,
  })
  return {
    ...state,
    tools: new Set([...state.tools, action]),
    next: function* () {
      yield {
        kind: "DisableTool",
        tool: action,
      }
    },
  }
}
