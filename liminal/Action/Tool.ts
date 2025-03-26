import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Agent } from "../common/Agent.js"
import type { JSONValue } from "../liminal_util/JSONValue.js"
import type { PromiseOr } from "../liminal_util/PromiseOr.js"
import type { DisableTool } from "./DisableTool.js"

export function* Tool<K extends string, O, R extends PromiseOr<Agent | JSONValue>, T extends Awaited<R>>(
  key: K,
  description: string,
  params: StandardSchemaV1<object, O>,
  implementation: (params: O) => R,
): Generator<Tool, () => Generator<DisableTool, void>> {
  return yield {
    kind: "Tool",
    key,
    description,
    params,
    implementation,
  }
}

export interface Tool<K extends string = string> {
  kind: "Tool"
  key: K
  description: string
  params: StandardSchemaV1
  implementation: (params: any) => PromiseOr<Agent | JSONValue>
}

export interface EnableToolEvent<K extends string = string> {
  type: "EnableTool"
  key: K
  description: string
  schema: object
}

export interface ToolEvent<K extends string = string, E extends Event = Event> {
  type: "Tool"
  key: K
  event: E
}
