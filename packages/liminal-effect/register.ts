import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Schema as ESchema } from "effect"
import { make, type SchemaClass } from "effect/Schema"
import { register } from "liminal-schema"
import type { json } from "liminal-util"

declare module "liminal-schema" {
  export interface SchemaAdapterRegistry {
    [EffectSchemaTag]: LiminalEffectSchema
  }
}

export declare const EffectSchemaTag: unique symbol

export type LiminalEffectSchema = StandardSchemaV1<json.ValueObject, any> & SchemaClass<any, json.ValueObject, never>

register<LiminalEffectSchema>({
  match: (type) => ESchema.isSchema(type),
  toJSON: (type) => make(type.ast),
})
