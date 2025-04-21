import type { Static, TSchema } from "@sinclair/typebox"
import { type SchemaRoot, validateSchemaRoot } from "liminal-schema"
import { JSON } from "liminal-util"

export function fromTypebox<B extends TSchema & { static: JSON.ValueObject }>(
  typeboxType: B,
): SchemaRoot<Static<B>> {
  return {
    ...validateSchemaRoot(typeboxType),
    "~standard": typeboxType["~standard"] as never,
  }
}
