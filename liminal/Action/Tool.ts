import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { FlowLike } from "../common/FlowLike.js"
import type { ExtractYScope, Scope } from "../Scope.js"
import type { DisableTool } from "./DisableTool.js"
import type { ToolEvent } from "../Event.js"

export function* Tool<K extends keyof any, O, R>(
  key: K,
  params: StandardSchemaV1<object, O>,
  implementation: (params: O) => R,
): Generator<
  Tool<K, R extends FlowLike<infer Y, infer R> ? ExtractYScope<Y, R> : never>,
  () => Generator<DisableTool<K>, void>
> {
  return yield {
    "": undefined!,
    kind: "EnableTool",
    key,
    params,
    implementation,
  }
}

export interface Tool<K extends keyof any = keyof any, S extends Scope = Scope> {
  "": S
  kind: "EnableTool"

  key: K
  params: StandardSchemaV1
  implementation: (params: any) => any
}

export type ExtractToolEvent<T extends Tool> = {
  [K in T["key"]]: ToolEvent<K, Extract<T, Tool<K>>[""]["Event"]>
}[T["key"]]
