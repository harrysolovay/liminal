import type { SchemaInteger } from "../../Schema.ts"
import { type LSchemaBase, make } from "./_schema_common.ts"

export interface integer extends SchemaInteger<number>, LSchemaBase {}

export const integer: integer = make({ type: "integer" })
