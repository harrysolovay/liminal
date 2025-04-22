import type { SchemaString } from "../SchemaString.ts"
import type { LTypeBase } from "./LTypeBase.ts"

export interface LString extends SchemaString, LTypeBase<string> {
  enum?: never
  const?: never
}

export const string: LString = null!
