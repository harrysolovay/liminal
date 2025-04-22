import type { JSONSchemaBase } from "./SchemaBase.ts"
import type { SchemaTypeName } from "./SchemaTypeName.ts"
import type { Value } from "./Value.ts"

export interface JSONSchemaTypeBase<K extends SchemaTypeName> extends JSONSchemaBase<"type"> {
  type: K | Array<SchemaTypeName>
  enum?: Array<Value>
  const?: Value
}
