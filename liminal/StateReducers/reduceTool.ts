import type { StateReducers } from "./StateReducers.js"
import { DisableTool } from "../Action/DisableTool.js"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.js"

export const reduceTool: StateReducers["reduceTool"] = (state, action) => {
  state.handler({
    type: "EnableTool",
    key: action.key,
    description: action.description,
    schema: JSONSchemaMemo(action.params),
  })
  return {
    ...state,
    tools: new Set([...state.tools, action]),
    next: () => DisableTool(action),
  }
}
