import type { StandardSchemaV1 } from "@standard-schema/spec"

export function Generation(): Generator<Generation, string>
export function Generation<O>(type: StandardSchemaV1<unknown, O>): Generator<Generation, O>
export function* Generation(type?: StandardSchemaV1): Generator<Generation, unknown> {
  return yield {
    kind: "Generation",
    type,
  }
}

export interface Generation {
  kind: "Generation"
  type: StandardSchemaV1 | undefined
}

export interface GenerateEvent<O = any> {
  type: "Generation"
  value: O
  schema?: object
}
