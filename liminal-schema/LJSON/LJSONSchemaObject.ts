import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaObject<T = any> {
  T: T
  type: "object"
  properties: Record<string, LJSONSchema>
  required: Array<string>
  additionalProperties?: false
}
