import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Type } from "arktype"
import { assertLSchema } from "../assertLSchema.ts"
import type { JSONValue } from "../JSON/JSONValue.ts"
import type { LSchema } from "../LSchema.ts"

// TODO: extract input type / constrain to `JSONValue`.
export function fromArktype<O>(arktype: Type<O>): LSchema<O, JSONValue> {
  const schema = arktype.toJsonSchema()
  assertLSchema(schema)
  return schema as never
}
