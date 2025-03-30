import { ActionBase } from "../Action/ActionBase.js"
import type { ActionReducer } from "../Action/ActionReducer.js"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.js"
import type { Tool } from "./Tool.js"

export const reduceTool: ActionReducer<Tool> = (state, action) => {
  state.events.emit({
    event: "EnableTool",
    key: action.key,
    description: action.description,
    schema: JSONSchemaMemo(action.params),
  })
  return state.spread({
    tools: new Set([...state.tools, action]),
    next: () =>
      ActionBase("DisableTool", {
        tool: action,
      }),
  })
}
