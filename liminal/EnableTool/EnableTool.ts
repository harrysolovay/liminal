import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "../Action/Action.ts"
import { ActionBase } from "../Action/ActionBase.ts"
import type { EnteredEvent, ExitedEvent } from "../Action/ActionEventBase.ts"
import type { ActionLike } from "../Action/ActionLike.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { DisableTool } from "../DisableTool/DisableTool.ts"
import type { ToolDisabledEvent } from "../DisableTool/DisableToolEvent.ts"
import type { Spec } from "../Spec.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import type { ToolCalledEvent, ToolEnabledEvent, ToolEvent } from "./EnableToolEvent.ts"
import type { ToolResult } from "./ToolResult.ts"

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
  })
}
