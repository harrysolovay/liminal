import type { SchemaString } from "../../Schema.ts"
import { type LSchemaBase, make } from "./_schema_common.ts"

interface string_ extends SchemaString<string>, LSchemaBase {
  enum?: never
  const?: never
}

const string_: string_ = make({ type: "string" })

export { string_ as string }
