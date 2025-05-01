import type { SchemaString } from "../../Schema.ts"
import { type LSchemaBase, make } from "./_schema_common.ts"

interface const_<K extends string> extends SchemaString<K>, LSchemaBase {
  enum?: never
  const: K
}

function const_<K extends string>(value: K): const_<K> {
  return make({
    type: "string",
    const: value,
  })
}

Object.defineProperty(const_, "name", { value: "const" })

export { const_ as const }
