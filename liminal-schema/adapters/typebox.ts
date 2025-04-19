import { type Static, type TSchema } from "@sinclair/typebox"
import { assertLSchema } from "../assertLSchema.ts"
import type { JSONValue } from "../JSON/JSONValue.ts"
import type { LSchema } from "../LSchema.ts"

export function fromTypebox<B extends TSchema & { static: JSONValue }>(typeboxType: B): LSchema<Static<B>> {
  assertLSchema(typeboxType)
  return typeboxType as never
}
