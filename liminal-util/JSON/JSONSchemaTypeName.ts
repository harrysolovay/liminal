import { assert } from "liminal-util"

export type JSONSchemaTypeName = keyof typeof JSON_SCHEMA_TYPE_NAMES

export const JSON_SCHEMA_TYPE_NAMES = {
  null: true,
  boolean: true,
  integer: true,
  number: true,
  string: true,
  array: true,
  object: true,
}

export function assertTypeName(value: unknown): asserts value is JSONSchemaTypeName {
  assert(typeof value === "string")
  assert(!!(JSON_SCHEMA_TYPE_NAMES as Record<string, boolean>)[value])
}
