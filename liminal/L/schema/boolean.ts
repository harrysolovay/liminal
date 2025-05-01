import type { SchemaBoolean } from "../../Schema.ts"
import { type LSchemaBase, make } from "./_schema_common.ts"

interface boolean_ extends SchemaBoolean<boolean>, LSchemaBase {}

const boolean_: boolean_ = make({ type: "boolean" })

export { boolean_ as boolean }
