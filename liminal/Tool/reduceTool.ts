import { ActionBase } from "../Action/ActionBase.js"
import type { ActionReducer } from "../Action/ActionReducer.js"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.js"
import type { Tool } from "./Tool.js"

export const reduceTool: ActionReducer<Tool> = (scope, action) => {
  scope.events.emit({
    type: "EnableTool",
    key: action.key,
    description: action.description,
    schema: JSONSchemaMemo(action.params),
  })
  return scope.spread({
    tools: new Set([...scope.tools, action]),
    next: () =>
      ActionBase("ToolRemoval", {
        tool: action,
      }),
  })
}
