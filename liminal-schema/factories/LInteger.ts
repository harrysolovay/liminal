import type { SchemaInteger } from "../Schema.ts"
import type { LTypeBase } from "./LTypeBase.ts"

export interface LInteger extends SchemaInteger, LTypeBase<number> {}

export const integer: LInteger = null!
