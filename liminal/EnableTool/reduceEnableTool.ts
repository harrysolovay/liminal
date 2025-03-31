import { ActionBase } from "../Action/ActionBase.ts"
import type { ActionReducer } from "../Action/ActionReducer.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"
import type { EnableTool } from "./EnableTool.ts"

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
