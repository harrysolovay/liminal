import type { SchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaString extends SchemaTypeBase<"string"> {
  enum?: Array<string>
  const?: string
}
