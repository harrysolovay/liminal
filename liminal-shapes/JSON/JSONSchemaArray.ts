import type { JSONSchema } from "./JSONSchema"
import type { JSONSchemaTypeBase } from "./JSONSchemaTypeBase.ts"

export interface JSONSchemaArray extends JSONSchemaTypeBase<"array"> {
  prefixItems?: Array<JSONSchema>
  items?: JSONSchema
  contains?: JSONSchema
  unevaluatedItems?: JSONSchema
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxContains?: number
  minContains?: number
}
