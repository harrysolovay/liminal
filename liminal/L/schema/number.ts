import type { SchemaNumber } from "../../Schema.ts"
import { type LSchemaBase, make } from "./_schema_common.ts"

interface number_ extends SchemaNumber<number>, LSchemaBase {}

const number_: number_ = make({ type: "number" })

export { number_ as number }
