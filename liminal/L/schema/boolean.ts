import type { SchemaBoolean } from "../../Schema.ts"
import { make, type TypeBase } from "./_schema_common.ts"

interface boolean_ extends SchemaBoolean<boolean>, TypeBase {}

const boolean_: boolean_ = make({ type: "boolean" })

export { boolean_ as boolean }
