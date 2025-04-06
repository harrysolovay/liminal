import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "./Action.ts"
import type { Actor } from "./Actor.ts"
import type { JSONValue } from "./util/JSONValue.ts"
import type { PromiseOr } from "./util/PromiseOr.ts"

export interface Tool {
  key: keyof any
  description: string
  params: StandardSchemaV1<JSONValue, JSONValue>
  implementation: ToolImplementation
}

export type ToolImplementation = (params: JSONValue) => Actor<Action, ToolResult> | PromiseOr<ToolResult>

export type ToolResult = JSONValue | void
