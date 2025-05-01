import type { Schema, SchemaArray } from "../../Schema.ts"
import { make } from "./_schema_common.ts"

export interface LArray<X extends Schema = Schema> extends SchemaArray<Array<X["T"]>> {
  items: X
}

export function array<X extends Schema>(items: X): LArray<X> {
  return make({
    type: "array",
    items,
  })
}
