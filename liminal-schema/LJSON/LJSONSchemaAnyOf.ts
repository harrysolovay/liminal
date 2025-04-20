import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaAnyOf<T = any> {
  T: T
  anyOf: Array<LJSONSchema>
}
