import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { ExtractScope, Scope } from "../Scope.js"
import type { DisableTool } from "./DisableTool.js"
import type { Flow } from "../common/Flow.js"

export function* AgentTool<K extends string, O, R>(
  key: K,
  params: StandardSchemaV1<object, O>,
  implementation: (params: O) => R,
): Generator<
  AgentTool<K, R extends Flow<infer Y, infer R> ? ExtractScope<Y, R> : never>,
  () => Generator<DisableTool<K>, void>
> {
  return yield {
    "": undefined!,
    kind: "AgentTool",
    key,
    params,
    implementation,
  }
}

export interface AgentTool<K extends string = string, S extends Scope = Scope> {
  "": S
  kind: "AgentTool"
  key: K
  params: StandardSchemaV1
  implementation: (params: any) => any
}
