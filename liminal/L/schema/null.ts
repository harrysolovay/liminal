import type { SchemaNull } from "../../Schema.ts"
import { make, type TypeBase } from "./_schema_common.ts"

export interface null_ extends SchemaNull<null>, TypeBase {}

const null_: null_ = make({ type: "null" })

export { null_ as null }
