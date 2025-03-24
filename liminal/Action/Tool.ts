import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Agent } from "../common/Agent.js"
import type { JSONValue } from "../liminal_util/JSONValue.js"
import type { PromiseOr } from "../liminal_util/PromiseOr.js"
import type { ExtractScope, Scope } from "../Scope.js"
import type { DisableTool } from "./DisableTool.js"

export declare function Tool<K extends string, O, R extends PromiseOr<Agent | JSONValue>, T extends Awaited<R>>(
  key: K,
  params: StandardSchemaV1<object, O>,
  implementation: (params: O) => R,
): Generator<
  Tool<K, R extends Agent<infer Y, infer R> ? ExtractScope<Y, R> : never>,
  () => Generator<DisableTool<K>, void>
>

export interface Tool<K extends string = string, S extends Scope = Scope> {
  "": S
  kind: "Tool"
  key: K
  params: StandardSchemaV1
  implementation: (params: any) => PromiseOr<Agent | JSONValue>
}
