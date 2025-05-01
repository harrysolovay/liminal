import type { SchemaString } from "../../Schema.ts"
import { make, type TypeBase } from "./_schema_common.ts"

interface string_ extends SchemaString<string>, TypeBase {
  enum?: never
  const?: never
}

const string_: string_ = make({ type: "string" })

export { string_ as string }
