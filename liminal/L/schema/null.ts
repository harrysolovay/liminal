import type { SchemaNull } from "../../Schema.ts"
import { type LSchemaBase, make } from "./_schema_common.ts"

export interface null_ extends SchemaNull<null>, LSchemaBase {}

const null_: null_ = make({ type: "null" })

export { null_ as null }
