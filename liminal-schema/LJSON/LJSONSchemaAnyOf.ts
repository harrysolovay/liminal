import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaAnyOf {
  anyOf: Array<LJSONSchema>
}
