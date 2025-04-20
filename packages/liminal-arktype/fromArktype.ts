import { Type } from "arktype"
import { type SchemaRoot, validateSchemaRoot } from "liminal"

// TODO: extract input type / constrain to `JSON.Value`.
export function fromArktype<T>(arktype: Type<T>): SchemaRoot<T> {
  return {
    ...validateSchemaRoot(arktype.toJsonSchema()),
    "~standard": arktype["~standard"] as never,
  }
}
