import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "../Action/Action.ts"
import { ActionBase } from "../Action/ActionBase.ts"
import type { ActionLike } from "../Action/ActionLike.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { DisableTool } from "../DisableTool/DisableTool.ts"
import type { ToolDisabledEvent } from "../DisableTool/DisableToolEvent.ts"
import type { JSONObject } from "../JSON/JSONObject.ts"
import type { Spec } from "../Spec.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import type { ToolEnabledEvent, ToolEnteredEvent, ToolExitedEvent, ToolInnerEvent } from "./EnableToolEvent.ts"
import type { ToolResult } from "./ToolResult.ts"

export interface EnableTool<S extends Spec = Spec> extends ActionBase<"enable_tool", S> {
  key: keyof any
  description: string
  params: StandardSchemaV1<JSONObject, JSONObject>
  implementation: ToolImplementation
}

export type ToolImplementation = (params: JSONObject) => Actor<ActionLike, ToolResult> | PromiseOr<ToolResult>

export function enableTool<K extends keyof any, P extends JSONObject, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, P>,
  implementation: (params: P) => R,
): Generator<
  EnableTool<{
    Field: never
    Event: ToolEnabledEvent<K> | ToolEnteredEvent<K, P> | ToolInnerEvent<K, never> | ToolExitedEvent<K, Awaited<R>>
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
  P extends JSONObject,
  Y extends ActionLike,
  R extends PromiseOr<ToolResult>,
>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, P>,
  implementation: (params: P) => Actor<Y, R>,
): Generator<
  EnableTool<{
    Field: Extract<Y, Action>[""]["Field"]
    Event:
      | ToolEnabledEvent<K>
      | ToolEnteredEvent<K, P>
      | ToolInnerEvent<K, Extract<Y, Action>[""]["Event"]>
      | ToolExitedEvent<K, Awaited<R>>
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
  params: StandardSchemaV1<JSONObject, JSONObject>,
  implementation: ToolImplementation,
): Generator<EnableTool, () => Generator<DisableTool, void>> {
  return yield ActionBase("enable_tool", {
    key,
    description,
    params,
    implementation,
  })
}
