import type { JSONSchema } from "./JSONSchema.ts"
import type { JSONSchemaTypeBase } from "./JSONSchemaTypeBase.ts"

export interface JSONSchemaString extends JSONSchemaTypeBase<"string"> {
  maxLength?: number
  minLength?: number
  pattern?: string
  contentEncoding?: string
  contentMediaType?: string
  contentSchema?: JSONSchema
}
