import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { ToolCalled } from "../events/ToolCalled.ts"
import type { ToolEnabled } from "../events/ToolEnabled.ts"
import type { MakeSpec, Spec } from "../Spec.ts"
import { Tool, type ToolImplementation, type ToolResult } from "../Tool.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import { disableTool } from "./disableTool.ts"

export interface enableTool<K extends JSONKey, A, S extends Spec> extends
  Action<
    "enable_tool",
    MakeSpec<{
      Event: ToolEnabled<K> | ToolCalled<K, A>
      Child: [S] extends [never] ? never : [K, S]
    }>
  >
{}

export function enableTool<K extends JSONKey, A, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, A>,
  implementation: (params: A) => R,
): Generator<enableTool<K, A, never>, Generator<disableTool<K>, void>>
export function enableTool<
  K extends JSONKey,
  A,
  Y extends Action,
  R extends ToolResult,
>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, A>,
  implementation: (params: A) => Actor<Y, R>,
): Generator<enableTool<K, A, Y[""]>, Generator<disableTool<K>, void>>
export function* enableTool(
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
      nextArg: disableTool(tool),
    }
  })
}
