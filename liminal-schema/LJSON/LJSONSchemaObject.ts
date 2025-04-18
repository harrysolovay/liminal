import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaObject {
  type: "object"
  properties: Record<string, LJSONSchema>
  required: Array<string>
  additionalProperties?: false
}
