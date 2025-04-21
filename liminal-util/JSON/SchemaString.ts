import type { Schema } from "./Schema.ts"
import type { JSONSchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaString extends JSONSchemaTypeBase<"string"> {
  maxLength?: number
  minLength?: number
  pattern?: string
  contentEncoding?: string
  contentMediaType?: string
  contentSchema?: Schema
}
