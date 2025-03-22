import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { FlowLike } from "../common/FlowLike.js"
import type { ExtractYScope, Scope } from "../Scope.js"
import type { DisableTool } from "./DisableTool.js"
import type { AgentToolEvent } from "../Event.js"

export function* AgentTool<K extends keyof any, O, R>(
  key: K,
  params: StandardSchemaV1<object, O>,
  implementation: (params: O) => R,
): Generator<
  AgentTool<K, R extends FlowLike<infer Y, infer R> ? ExtractYScope<Y, R> : never>,
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

export interface AgentTool<K extends keyof any = keyof any, S extends Scope = Scope> {
  "": S
  kind: "AgentTool"

  key: K
  params: StandardSchemaV1
  implementation: (params: any) => any
}

export type ExtractToolEvent<T extends AgentTool> = {
  [K in T["key"]]: AgentToolEvent<K, Extract<T, AgentTool<K>>[""]["Event"]>
}[T["key"]]
