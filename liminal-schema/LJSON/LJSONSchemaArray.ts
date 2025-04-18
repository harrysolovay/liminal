import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaArray {
  type: "array"
  items: LJSONSchema
}
