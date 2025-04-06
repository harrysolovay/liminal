import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { ChildEvent } from "../events/ChildEvent.ts"
import type { ToolCalledEvent } from "../events/ToolCalledEvent.ts"
import type { ToolDisabledEvent } from "../events/ToolDisabledEvent.ts"
import type { ToolEnabledEvent } from "../events/ToolEnabledEvent.ts"
import type { Tool, ToolImplementation, ToolResult } from "../Tool.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import { disableTool } from "./DisableTool.ts"

export function enableTool<K extends keyof any, A extends JSONValue, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONValue, A>,
  implementation: (params: A) => R,
): Generator<
  Action<"enable_tool", {
    Entry: never
    Event: ToolEnabledEvent<K> | ChildEvent<"tool", K, ToolCalledEvent<A>, Awaited<R>>
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
  K extends keyof any,
  A extends JSONValue,
  Y extends Action,
  R extends PromiseOr<ToolResult>,
>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONValue, A>,
  implementation: (params: A) => Actor<Y, R>,
): Generator<
  Action<"enable_tool", {
    Entry: Extract<Y, Action>[""]["Entry"]
    Event:
      | ToolEnabledEvent<K>
      | ChildEvent<
        "tool",
        K,
        ToolCalledEvent<A> | Extract<Y, Action>[""]["Event"],
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
  key: keyof any,
  description: string,
  params: StandardSchemaV1<JSONValue, JSONValue>,
  implementation: ToolImplementation,
): Generator<Action<"enable_tool">, Generator<Action<"disable_tool">, void>> {
  return yield Action("enable_tool", (scope) => {
    scope.event({
      type: "tool_enabled",
      key,
      description,
      schema: JSONSchemaMemo(params),
    })
    const tool: Tool = {
      key,
      description,
      params,
      implementation,
    }
    return {
      ...scope,
      tools: new Set([...scope.tools, tool]),
      nextArg: disableTool(tool),
    }
  })
}
