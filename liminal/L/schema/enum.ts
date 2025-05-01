import type { SchemaString } from "../../Schema.ts"
import { type LSchemaBase, make } from "./_schema_common.ts"

interface enum_<V extends Array<string> = Array<string>> extends SchemaString<V[number]>, LSchemaBase {
  enum: V
  const?: never
}

function enum_<const V extends Array<string>>(...values: V): enum_<V> {
  return make({
    type: "string",
    enum: values,
  })
}

Object.defineProperty(enum_, "name", { value: "enum" })

export { enum_ as enum }
