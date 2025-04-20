import { type Static, type TSchema } from "@sinclair/typebox"
import type { JSON } from "liminal-util"
import { ensureLSchema } from "../ensureLSchema.ts"
import type { LSchema } from "../LSchema.ts"

export function fromTypebox<B extends TSchema & { static: JSON.JSONValue }>(typeboxType: B): LSchema<Static<B>> {
  return {
    ...ensureLSchema(typeboxType),
    "~standard": typeboxType["~standard"] as never,
  }
}
