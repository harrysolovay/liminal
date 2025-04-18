import type { LJSONSchemaAnyOf } from "./LJSONSchemaAnyOf.ts"
import { type LJSONSchemaType } from "./LJSONSchemaType.ts"

export type LJSONSchema = LJSONSchemaType | LJSONSchemaAnyOf
