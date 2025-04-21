import type { Schema } from "./Schema.ts"
import type { JSONSchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaArray extends JSONSchemaTypeBase<"array"> {
  prefixItems?: Array<Schema>
  items?: Schema
  contains?: Schema
  unevaluatedItems?: Schema
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxContains?: number
  minContains?: number
}
