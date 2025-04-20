import { Schema } from "effect"
import { make } from "effect/JSONSchema"
import { JSON } from "liminal-util"
import { ensureLSchema } from "../ensureLSchema.ts"
import type { LSchema } from "../LSchema.ts"

export function fromEffectSchema<T>(eSchema: Schema.Schema<T, JSON.JSONValue, never>): LSchema<T> {
  return {
    ...ensureLSchema(make(eSchema)),
    "~standard": Schema.standardSchemaV1(eSchema)["~standard"] as never,
  }
}
