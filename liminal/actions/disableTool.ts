import { Action } from "../Action.ts"
import type { ToolDisabled } from "../events/ToolDisabled.ts"
import type { MakeSpec } from "../Spec.ts"
import type { Tool } from "../Tool.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export interface disableTool<K extends JSONKey> extends Action<"disable_tool", MakeSpec<{ Event: ToolDisabled<K> }>> {}

export function* disableTool<K extends JSONKey>(tool: Tool<K>): Generator<
  disableTool<K>,
  void
> {
  yield Action("disable_tool", (scope) => {
    scope.event({
      type: "tool_disabled",
      tool: tool.toolKey,
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
