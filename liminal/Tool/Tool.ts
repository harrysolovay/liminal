import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "../Action/Action.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { ActionLike } from "../Action/ActionLike.js"
import type { Actor } from "../Actor/Actor.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { Spec } from "../Spec.js"
import type { ToolRemoval } from "../ToolRemoval/ToolRemoval.js"
import type { ToolRemovalEvent } from "../ToolRemoval/ToolRemovalEvent.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { ToolEvent } from "./ToolEvent.js"
import type { ToolResult } from "./ToolResult.js"

export interface Tool<S extends Spec = Spec> extends ActionBase<"Tool", S> {
  key: keyof any
  description: string
  params: StandardSchemaV1<JSONObject, JSONObject>
  implementation: ToolImplementation
}

export type ToolImplementation = (params: JSONObject) => Actor<ActionLike, ToolResult> | PromiseOr<ToolResult>

export function Tool<K extends keyof any, P extends JSONObject, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, P>,
  implementation: (params: P) => R,
): Generator<
  Tool<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolEvent<K, P, never, Awaited<R>>
  }>,
  () => Generator<
    ToolRemoval<{
      LanguageModel: never
      EmbeddingModel: never
      Event: ToolRemovalEvent<K>
    }>,
    void
  >
>
export function Tool<K extends keyof any, P extends JSONObject, Y extends ActionLike, R extends PromiseOr<ToolResult>>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, P>,
  implementation: (params: P) => Actor<Y, R>,
): Generator<
  Tool<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolEvent<K, P, Extract<Y, Action>[""]["Event"], Awaited<R>>
  }>,
  () => Generator<
    ToolRemoval<{
      LanguageModel: never
      EmbeddingModel: never
      Event: ToolRemovalEvent<K>
    }>,
    void
  >
>
export function* Tool(
  key: keyof any,
  description: string,
  params: StandardSchemaV1<JSONObject, JSONObject>,
  implementation: ToolImplementation,
): Generator<Tool, () => Generator<ToolRemoval, void>> {
  return yield ActionBase("Tool", {
    key,
    description,
    params,
    implementation,
  })
}
