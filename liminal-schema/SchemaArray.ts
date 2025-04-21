import type { Schema } from "./Schema.ts"
import type { SchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaArray extends SchemaTypeBase<"array"> {
  items: Schema
}
