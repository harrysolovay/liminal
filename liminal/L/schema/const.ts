import type { SchemaString } from "../../Schema.ts"
import { make, type TypeBase } from "./_schema_common.ts"

interface const_<K extends string> extends SchemaString<K>, TypeBase {
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
