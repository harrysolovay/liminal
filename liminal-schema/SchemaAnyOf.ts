import type { Schema } from "./Schema.ts"
import type { SchemaBase } from "./SchemaBase.ts"

export interface SchemaAnyOf extends SchemaBase {
  anyOf: Array<Schema>
}
