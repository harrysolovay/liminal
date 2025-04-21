import type { Schema } from "./Schema.ts"
import type { SchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaObject extends SchemaTypeBase<"object"> {
  properties: Record<string, Schema>
  required: Array<string>
  additionalProperties?: false
}
