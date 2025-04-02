import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "../Action.ts"
import type { ActionEvent } from "../ActionEvent.ts"
import type { ActionLike } from "../Actor/ActionLike.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { Spec } from "../Spec.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import type { ActionEventBase, EnteredEvent, ExitedEvent } from "./actions_base.ts"
import { ActionBase } from "./actions_base.ts"
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
    Field: never
    Event: ToolEnabledEvent<K> | ToolEvent<K, ToolCalledEvent<A> | EnteredEvent | ExitedEvent<Awaited<R>>>
  }>,
  () => Generator<
    DisableTool<{
      Field: never
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
    Field: Extract<Y, Action>[""]["Field"]
    Event:
      | ToolEnabledEvent<K>
      | ToolEvent<K, ToolCalledEvent<A> | EnteredEvent | Extract<Y, Action>[""]["Event"] | ExitedEvent<Awaited<R>>>
  }>,
  () => Generator<
    DisableTool<{
      Field: never
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

export interface ToolEvent<K extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"tool">
{
  tool: K
  event: E
}

export interface ToolCalledEvent<A extends JSONValue = JSONValue> extends ActionEventBase<"tool_called"> {
  args: A
}

export type ToolResult = JSONValue | void
