import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { Agent } from "../Agent.ts"
import type { ToolCalled } from "../events/ToolCalled.ts"
import type { ToolDisabled } from "../events/ToolDisabled.ts"
import type { ToolEnabled } from "../events/ToolEnabled.ts"
import type { Spec } from "../Spec.ts"
import { Tool, type ToolImplementation, type ToolResult } from "../Tool.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"

export interface disableTool<K extends JSONKey> extends Action<"disable_tool", Spec.Make<{ Event: ToolDisabled<K> }>> {}

export function tool<K extends JSONKey, A>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, A>,
  implementation: (params: A) => PromiseOr<ToolResult>,
): Generator<
  Action<
    "enable_tool",
    Spec.Make<{
      Event: ToolEnabled<K> | ToolCalled<K, A>
    }>
  >,
  Generator<disableTool<K>, void>
>
export function tool<
  K extends JSONKey,
  A,
  Y extends Action,
  T extends ToolResult,
>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, A>,
  implementation: (params: A) => Agent<Y, T>,
): Generator<
  Action<
    "enable_tool",
    Spec.Make<{
      Event: ToolEnabled<K> | ToolCalled<K, A>
      Child: [K, Y[""]]
      Entry: Y[""]["Entry"]
      Value: T
    }>
  >,
  Generator<disableTool<K>, void>
>
export function* tool(
  key: JSONKey,
  description: string,
  params: StandardSchemaV1<JSONObject, any>,
  implementation: ToolImplementation,
): Generator<Action<"enable_tool">, Generator<Action<"disable_tool">, void>> {
  return yield Action("enable_tool", async (scope) => {
    scope.event({
      type: "tool_enabled",
      description,
      schema: await JSONSchemaMemo(params),
      tool: key,
    })
    const tool = Tool({
      toolKey: key,
      description,
      params,
      implementation,
    })
    return {
      ...scope,
      tools: new Set([...scope.tools, tool]),
      nextArg: (function*() {
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
      })(),
    }
  })
}
