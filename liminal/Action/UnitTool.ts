import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { DisableTool } from "./DisableTool.js"

export function* UnitTool<K extends string, O, R>(
  key: K,
  params: StandardSchemaV1<object, O>,
  implementation: (params: O) => R,
): Generator<UnitTool<K>, () => Generator<DisableTool<K>, void>> {
  return yield {
    kind: "UnitTool",
    key,
    params,
    implementation,
  }
}

export interface UnitTool<K extends string = string> {
  kind: "UnitTool"
  key: K
  params: StandardSchemaV1
  implementation: (params: any) => any
}
