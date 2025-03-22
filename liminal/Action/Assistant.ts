import type { StandardSchemaV1 } from "@standard-schema/spec"

export function Assistant(): Generator<Assistant, string>
export function Assistant<O>(type: StandardSchemaV1<unknown, O>): Generator<Assistant, O>
export function* Assistant(type?: StandardSchemaV1): Generator<Assistant, unknown> {
  return yield {
    kind: "Assistant",
    type,
  }
}

export interface Assistant {
  kind: "Assistant"
  type: StandardSchemaV1 | undefined
}
