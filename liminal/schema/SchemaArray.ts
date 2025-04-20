import type { Schema } from "./Schema.ts"

export interface SchemaArray {
  type: "array"
  items: Schema
}
