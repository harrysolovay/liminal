import { type Static, type TSchema } from "@sinclair/typebox"
import type { JSON } from "liminal-util"
import { assertLSchema } from "../assertLSchema.ts"
import type { LSchema } from "../LSchema.ts"

export function fromTypebox<B extends TSchema & { static: JSON.JSONValue }>(typeboxType: B): LSchema<Static<B>> {
  assertLSchema(typeboxType)
  return typeboxType as never
}
