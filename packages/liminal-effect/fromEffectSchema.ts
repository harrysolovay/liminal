import { Schema as ESchema } from "effect"
import { make } from "effect/JSONSchema"
import { type SchemaRoot, validateSchemaRoot } from "liminal-schema"
import { JSON } from "liminal-util"

export function fromEffectSchema<T>(eSchema: ESchema.Schema<T, JSON.ValueObject, never>): SchemaRoot<T> {
  return {
    ...validateSchemaRoot(make(eSchema)),
    "~standard": ESchema.standardSchemaV1(eSchema)["~standard"] as never,
  }
}
