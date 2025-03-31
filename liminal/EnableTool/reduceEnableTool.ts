import { ActionBase } from "../Action/ActionBase.js"
import type { ActionReducer } from "../Action/ActionReducer.js"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.js"
import type { EnableTool } from "./EnableTool.js"

export const reduceEnableTool: ActionReducer<EnableTool> = (scope, action) => {
  scope.events.emit({
    type: "tool_enabled",
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
