import type { SchemaNumber } from "../../Schema.ts"
import { make, type TypeBase } from "./_schema_common.ts"

interface number_ extends SchemaNumber<number>, TypeBase {}

const number_: number_ = make({ type: "number" })

export { number_ as number }
