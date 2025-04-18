import type { JSONSchema } from "./JSONSchema.ts"
import type { JSONSchemaTypeBase } from "./JSONSchemaTypeBase.ts"

export interface JSONSchemaObject extends JSONSchemaTypeBase<"object"> {
  properties?: Record<string, JSONSchema>
  maxProperties?: number
  minProperties?: number
  required?: string[]
  dependentRequired?: { [key: string]: Array<string> }
  additionalProperties?: JSONSchema
  patternProperties?: { [key: string]: JSONSchema }
  propertyNames?: JSONSchema
  dependentSchemas?: { [key: string]: JSONSchema }
}
