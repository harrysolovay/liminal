import { Action, type EventBase } from "../Action.ts"
import type { Tool } from "../Tool.ts"

export function* disableTool(tool: Tool): Generator<Action<"disable_tool", never>, void> {
  yield Action<never>()("disable_tool", (scope) => {
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

export interface ToolDisabledEvent<K extends keyof any = keyof any> extends EventBase<"tool_disabled"> {
  tool: K
}
