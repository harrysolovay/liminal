import type { Schema } from "./Schema.ts"
import type { JSONSchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaObject extends JSONSchemaTypeBase<"object"> {
  properties?: Record<string, Schema>
  maxProperties?: number
  minProperties?: number
  required?: string[]
  dependentRequired?: { [key: string]: Array<string> }
  additionalProperties?: Schema
  patternProperties?: { [key: string]: Schema }
  propertyNames?: Schema
  dependentSchemas?: { [key: string]: Schema }
}
