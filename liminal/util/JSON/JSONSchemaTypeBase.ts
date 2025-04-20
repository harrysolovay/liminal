import type { JSONSchemaBase } from "./JSONSchemaBase.ts"
import type { JSONSchemaTypeName } from "./JSONSchemaTypeName.ts"
import type { JSONValue } from "./JSONValue.ts"

export interface JSONSchemaTypeBase<K extends JSONSchemaTypeName> extends JSONSchemaBase<"type"> {
  type: K | Array<JSONSchemaTypeName>
  enum?: Array<JSONValue>
  const?: JSONValue
}
