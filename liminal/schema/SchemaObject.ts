import type { Schema } from "./Schema.ts"

export interface SchemaObject {
  type: "object"
  properties: Record<string, Schema>
  required: Array<string>
  additionalProperties?: false
}
