import { Schema as ESchema } from "effect"
import { make } from "effect/JSONSchema"
import { _util, type SchemaRoot, validateSchemaRoot } from "liminal"

export function fromEffectSchema<T>(eSchema: ESchema.Schema<T, _util.JSONValueObject, never>): SchemaRoot<T> {
  return {
    ...validateSchemaRoot(make(eSchema)),
    "~standard": ESchema.standardSchemaV1(eSchema)["~standard"] as never,
  }
}
