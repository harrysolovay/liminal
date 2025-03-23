import type { StandardSchemaV1 } from "@standard-schema/spec"

export function Assistant(): Generator<Assistant<string>, string>
export function Assistant<O>(type: StandardSchemaV1<unknown, O>): Generator<Assistant<O>, O>
export function* Assistant(type?: StandardSchemaV1): Generator<Assistant, unknown> {
  return yield {
    "": undefined!,
    kind: "Assistant",
    type,
  }
}

export interface Assistant<T = any> {
  "": T
  kind: "Assistant"
  type: StandardSchemaV1 | undefined
}
