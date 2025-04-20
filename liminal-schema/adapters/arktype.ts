import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Type } from "arktype"
import { JSON } from "liminal-util"
import { assertLSchema } from "../assertLSchema.ts"
import type { LSchema } from "../LSchema.ts"

// TODO: extract input type / constrain to `JSON.Value`.
export function fromArktype<T>(arktype: Type<T>): LSchema<T> {
  const schema = arktype.toJsonSchema()
  assertLSchema(schema)
  return schema as never
}
