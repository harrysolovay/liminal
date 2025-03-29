import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { EventBase } from "./EventBase.js"
import { ActionBase } from "./ActionBase.js"
import type { Actor } from "../common/Actor.js"
import type { JSONObject, JSONValue } from "../util/JSONValue.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { ToolRemoval, ToolRemovalEvent } from "./DisableTool.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { Spec } from "../Spec.js"
import type { Action, ActionLike } from "./Action.js"

export interface Tool<S extends Spec = Spec> extends ActionBase<"Tool", S> {
  key: string
  description: string
  params: StandardSchemaV1<JSONObject, JSONObject>
  implementation: ToolImplementation
}

export type ToolImplementation = (params: JSONObject) => Actor<ActionLike, ToolResult> | PromiseOr<ToolResult>

export type ToolResult = JSONValue | void

export function Tool<K extends string, P extends JSONObject, R extends PromiseOr<ToolResult>>(
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
export function Tool<K extends string, P extends JSONObject, Y extends ActionLike, R extends PromiseOr<ToolResult>>(
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
  key: string,
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

export type ToolEvent<
  K extends string = string,
  A extends JSONObject = JSONObject,
  E extends ActionEvent = any,
  T extends ToolResult = ToolResult,
> = EnableToolEvent<K> | ToolEnterEvent<K, A> | ToolInnerEvent<K, E> | ToolExitEvent<K, T>

export interface EnableToolEvent<K extends string = string> extends EventBase<"EnableTool"> {
  key: K
  description: string
  schema: object
}

export interface ToolEnterEvent<K extends string, A extends JSONObject> extends EventBase<"ToolEnter"> {
  tool: K
  args: A
}

export interface ToolInnerEvent<K extends string, E extends ActionEvent> extends EventBase<"ToolInner"> {
  tool: K
  inner: E
}

export interface ToolExitEvent<K extends string, T extends ToolResult> extends EventBase<"ToolExit"> {
  tool: K
  result: T
}
