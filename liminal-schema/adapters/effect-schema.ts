import type { Schema } from "effect"
import { make } from "effect/JSONSchema"
import { assertLSchema } from "../assertLSchema.ts"
import type { JSONValue } from "../JSON/JSONValue.ts"
import type { LSchema } from "../LSchema.ts"

export function fromEffectSchema<O, I extends JSONValue, R>(eSchema: Schema.Schema<O, I, R>): LSchema<O, I> {
  const schema = make(eSchema)
  assertLSchema(schema)
  return schema as never
}
