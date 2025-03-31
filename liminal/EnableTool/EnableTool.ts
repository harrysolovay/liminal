import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "../Action/Action.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { ActionLike } from "../Action/ActionLike.js"
import type { Actor } from "../Actor/Actor.js"
import type { DisableTool } from "../DisableTool/DisableTool.js"
import type { ToolDisabledEvent } from "../DisableTool/DisableToolEvent.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { Spec } from "../Spec.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { ToolEnabledEvent, ToolEnteredEvent, ToolExitedEvent, ToolInnerEvent } from "./EnableToolEvent.js"
import type { ToolResult } from "./ToolResult.js"

export interface EnableTool<S extends Spec = Spec> extends ActionBase<"enable_tool", S> {
  key: keyof any
  description: string
  params: StandardSchemaV1<JSONObject, JSONObject>
  implementation: ToolImplementation
}

export type ToolImplementation = (params: JSONObject) => Actor<ActionLike, ToolResult> | PromiseOr<ToolResult>

export function EnableTool<K extends keyof any, P extends JSONObject, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, P>,
  implementation: (params: P) => R,
): Generator<
  EnableTool<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolEnabledEvent<K> | ToolEnteredEvent<K, P> | ToolInnerEvent<K, never> | ToolExitedEvent<K, Awaited<R>>
  }>,
  () => Generator<
    DisableTool<{
      LanguageModel: never
      EmbeddingModel: never
      Event: ToolDisabledEvent<K>
    }>,
    void
  >
>
export function EnableTool<
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
    LanguageModel: never
    EmbeddingModel: never
    Event:
      | ToolEnabledEvent<K>
      | ToolEnteredEvent<K, P>
      | ToolInnerEvent<K, Extract<Y, Action>[""]["Event"]>
      | ToolExitedEvent<K, Awaited<R>>
  }>,
  () => Generator<
    DisableTool<{
      LanguageModel: never
      EmbeddingModel: never
      Event: ToolDisabledEvent<K>
    }>,
    void
  >
>
export function* EnableTool(
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
