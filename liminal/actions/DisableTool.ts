import { Action } from "../Action.ts"
import type { Tool } from "../Tool.ts"

export function* disableTool(tool: Tool): Generator<Action<"disable_tool", never>, void> {
  yield Action("disable_tool", (scope) => {
    scope.event({
      type: "tool_disabled",
      tool: tool.key,
    })
    const tools = new Set(scope.tools)
    tools.delete(tool)
    return {
      ...scope,
      tools,
      nextArg: undefined,
    }
  })
}
