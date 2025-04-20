import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaArray<T = any> {
  T: T
  type: "array"
  items: LJSONSchema
}
