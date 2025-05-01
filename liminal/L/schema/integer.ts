import type { SchemaInteger } from "../../Schema.ts"
import { make, type TypeBase } from "./_schema_common.ts"

export interface integer extends SchemaInteger<number>, TypeBase {}

export const integer: integer = make({ type: "integer" })
