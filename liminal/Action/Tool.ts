import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { EventBase } from "./event_common.js"
import { ActionBase } from "./ActionBase.js"
import type { Actor } from "../common/Actor.js"
import type { JSONValue } from "../util/JSONValue.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { DisableTool } from "./DisableTool.js"
import type { ActionEvent } from "./ActionEvent.js"

export function* Tool<K extends string, O, R extends PromiseOr<Actor | JSONValue>, T extends Awaited<R>>(
  key: K,
  description: string,
  params: StandardSchemaV1<object, O>,
  implementation: (params: O) => R,
): Generator<Tool, () => Generator<DisableTool, void>> {
  return yield ActionBase("Tool", {
    key,
    description,
    params,
    implementation,
  })
}

export interface Tool<K extends string = string> extends ActionBase<"Tool"> {
  key: K
  description: string
  params: StandardSchemaV1
  implementation: (params: any) => PromiseOr<Actor | JSONValue>
}

export interface EnableToolEvent<K extends string = string> extends EventBase<"EnableTool"> {
  key: K
  description: string
  schema: object
}

export interface ToolCallEvent<K extends string = string, E extends ActionEvent = ActionEvent>
  extends EventBase<"ToolCall"> {
  key: K
  inner: E
}
