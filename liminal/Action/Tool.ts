import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { EnterEvent, EventBase, ExitEvent } from "./event_common.js"
import { ActionBase } from "./ActionBase.js"
import type { Actor } from "../common/Actor.js"
import type { JSONObject } from "../util/JSONValue.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { DisableTool, DisableToolEvent } from "./DisableTool.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { Spec } from "../Spec.js"
import type { Action, ActionLike } from "./Action.js"

export interface Tool<K extends string = string, P extends JSONObject = JSONObject, S extends Spec = Spec>
  extends ActionBase<"Tool", S> {
  key: K
  description: string
  params: StandardSchemaV1<JSONObject, P>
  implementation: (params: P) => PromiseOr<Actor | JSONObject | void>
}

export function Tool<K extends string, P extends JSONObject>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, P>,
  implementation: (params: P) => PromiseOr<JSONObject | void>,
): Generator<
  Tool<K, P, Spec<never, never, EnableToolEvent<K> | ToolCallEvent<K, P, never>>>,
  () => Generator<
    DisableTool<
      K,
      {
        LanguageModel: never
        EmbeddingModel: never
        Event: DisableToolEvent<K>
      }
    >,
    void
  >
>
export function Tool<K extends string, P extends JSONObject, Y extends ActionLike, R>(
  key: K,
  description: string,
  params: StandardSchemaV1<JSONObject, P>,
  implementation: (params: P) => Actor<Y, R>,
): Generator<
  Tool<
    K,
    P,
    Spec<
      never,
      never,
      EnableToolEvent<K> | ToolCallEvent<K, P, EnterEvent | Extract<Y, Action>[""]["Event"] | ExitEvent<Awaited<R>>>
    >
  >,
  () => Generator<
    DisableTool<
      K,
      {
        LanguageModel: never
        EmbeddingModel: never
        Event: DisableToolEvent<K>
      }
    >,
    void
  >
>
export function* Tool(
  key: string,
  description: string,
  params: StandardSchemaV1<JSONObject, JSONObject>,
  implementation: (params: JSONObject) => any,
): Generator<Tool, () => Generator<DisableTool, void>> {
  return yield ActionBase("Tool", {
    key,
    description,
    params,
    implementation,
  })
}

export interface EnableToolEvent<K extends string = string> extends EventBase<"EnableTool"> {
  key: K
  description: string
  schema: object
}

export interface ToolCallEvent<
  K extends string = string,
  P extends JSONObject = JSONObject,
  E extends ActionEvent = ActionEvent,
> extends EventBase<"ToolCall"> {
  key: K
  args: P
  inner: E
}
