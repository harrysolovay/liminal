import { Type } from "arktype"
import { ensureLSchema } from "../ensureLSchema.ts"
import type { LSchema } from "../LSchema.ts"

// TODO: extract input type / constrain to `JSON.Value`.
export function fromArktype<T>(arktype: Type<T>): LSchema<T> {
  return {
    ...ensureLSchema(arktype.toJsonSchema()),
    "~standard": arktype["~standard"] as never,
  }
}
