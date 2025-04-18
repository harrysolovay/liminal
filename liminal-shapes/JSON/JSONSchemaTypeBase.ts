import type { JSONSchemaBase } from "./JSONSchemaBase.ts"
import type { JSONValue } from "./JSONValue.ts"

export type JSONSchemaTypeName = "null" | "boolean" | "number" | "integer" | "string" | "array" | "object"

export interface JSONSchemaTypeBase<K extends JSONSchemaTypeName> extends JSONSchemaBase<"type"> {
  type: K | Array<JSONSchemaTypeName>
  enum?: Array<JSONValue>
  const?: JSONValue
}
