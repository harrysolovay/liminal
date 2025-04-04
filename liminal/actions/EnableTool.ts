import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action, ActionLike } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { Spec } from "../Spec.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import type { ActionEventBase } from "./actions_base.ts"
import { ActionBase } from "./actions_base.ts"
import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions_common.ts"
import { type DisableTool, disableTool } from "./DisableTool.ts"
import type { ToolDisabledEvent } from "./DisableTool.ts"

export interface EnableTool<S extends Spec = Spec> extends ActionBase<"enable_tool", S> {
  key: keyof any
  description: string
  params: StandardSchemaV1<JSONValue, JSONValue>
  implementation: ToolImplementation
}

export type ToolImplementation = (params: JSONValue) => Actor<ActionLike, ToolResult> | PromiseOr<ToolResult>

export function enableTool<K extends keyof any, A extends JSONValue, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONValue, A>,
  implementation: (params: A) => R,
): Generator<
  EnableTool<{
    Entry: never
    Event: ToolEnabledEvent<K> | ChildEvent<"tool", K, ToolCalledEvent<A> | EnteredEvent | ExitedEvent<Awaited<R>>>
  }>,
  () => Generator<
    DisableTool<{
      Entry: never
      Event: ToolDisabledEvent<K>
    }>,
    void
  >
>
export function enableTool<
  K extends keyof any,
  A extends JSONValue,
  Y extends ActionLike,
  R extends PromiseOr<ToolResult>,
>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONValue, A>,
  implementation: (params: A) => Actor<Y, R>,
): Generator<
  EnableTool<{
    Entry: Extract<Y, Action>[""]["Entry"]
    Event:
      | ToolEnabledEvent<K>
      | ChildEvent<
        "tool",
        K,
        ToolCalledEvent<A> | EnteredEvent | Extract<Y, Action>[""]["Event"] | ExitedEvent<Awaited<R>>
      >
  }>,
  () => Generator<
    DisableTool<{
      Entry: never
      Event: ToolDisabledEvent<K>
    }>,
    void
  >
>
export function* enableTool(
  key: keyof any,
  description: string,
  params: StandardSchemaV1<JSONValue, JSONValue>,
  implementation: ToolImplementation,
): Generator<EnableTool, () => Generator<DisableTool, void>> {
  return yield ActionBase("enable_tool", {
    key,
    description,
    params,
    implementation,
    reduce(scope) {
      scope.events.emit({
        type: "tool_enabled",
        key,
        description,
        schema: JSONSchemaMemo(params),
      })
      return scope.spread({
        tools: new Set([...scope.tools, this as never]),
        next: () => disableTool(this as never),
      })
    },
  })
}

export interface ToolEnabledEvent<K extends keyof any = keyof any> extends ActionEventBase<"tool_enabled"> {
  key: K
  description: string
  schema: object
}

export interface ToolCalledEvent<A extends JSONValue = JSONValue> extends ActionEventBase<"tool_called"> {
  args: A
}

export type ToolResult = JSONValue | void
