import type { SchemaAnyOf } from "./SchemaAnyOf.ts"
import { type SchemaType } from "./SchemaType.ts"

export type Schema = SchemaType | SchemaAnyOf
