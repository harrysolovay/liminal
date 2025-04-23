import type { SchemaArray } from "../Schema.ts"
import type { LType } from "./LType.ts"
import type { LTypeBase } from "./LTypeBase.ts"

export interface LArray<S extends LType> extends SchemaArray, LTypeBase<Array<S["T"]>> {
  items: S
}

export function array<S extends LType>(_schema: S): LArray<S> {
  return null!
}
