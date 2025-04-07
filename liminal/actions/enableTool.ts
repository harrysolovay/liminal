import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { ChildEvent } from "../events/ChildEvent.ts"
import type { ToolCalledEvent } from "../events/ToolCalledEvent.ts"
import type { ToolDisabledEvent } from "../events/ToolDisabledEvent.ts"
import type { ToolEnabledEvent } from "../events/ToolEnabledEvent.ts"
import { Tool, type ToolImplementation, type ToolResult } from "../Tool.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import { disableTool } from "./disableTool.ts"

export function enableTool<K extends JSONKey, A, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, A>,
  implementation: (params: A) => R,
): Generator<
  Action<"enable_tool", {
    Entry: never
    Event: ToolEnabledEvent<K> | ChildEvent<"tool", K, ToolCalledEvent<K, A>, Awaited<R>>
    Throw: never
  }>,
  Generator<
    Action<"disable_tool", {
      Entry: never
      Event: ToolDisabledEvent<K>
      Throw: never
    }>,
    void
  >
>
export function enableTool<
  K extends JSONKey,
  A,
  Y extends Action,
  R extends PromiseOr<ToolResult>,
>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, A>,
  implementation: (params: A) => Actor<Y, R>,
): Generator<
  Action<"enable_tool", {
    Entry: Extract<Y, Action>[""]["Entry"]
    Event:
      | ToolEnabledEvent<K>
      | ChildEvent<
        "tool",
        K,
        ToolCalledEvent<K, A> | Extract<Y, Action>[""]["Event"],
        Awaited<R>
      >
    Throw: never
  }>,
  Generator<
    Action<"disable_tool", {
      Entry: never
      Event: ToolDisabledEvent<K>
      Throw: never
    }>,
    void
  >
>
export function* enableTool(
  key: JSONKey,
  description: string,
  params: StandardSchemaV1<JSONObject, any>,
  implementation: ToolImplementation,
): Generator<Action<"enable_tool">, Generator<Action<"disable_tool">, void>> {
  return yield Action("enable_tool", async (scope) => {
    scope.event({
      type: "tool_enabled",
      key,
      description,
      schema: await JSONSchemaMemo(params),
    })
    const tool = Tool({
      key,
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
