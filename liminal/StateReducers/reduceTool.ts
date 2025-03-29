import type { StateReducers } from "./StateReducers.js"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.js"
import { ActionBase } from "../Action/ActionBase.js"

export const reduceTool: StateReducers["reduceTool"] = (state, action) => {
  state.events.emit({
    event: "EnableTool",
    key: action.key,
    description: action.description,
    schema: JSONSchemaMemo(action.params),
  })
  return {
    ...state,
    tools: new Set([...state.tools, action]),
    next: () =>
      ActionBase("DisableTool", {
        tool: action,
      }),
  }
}
