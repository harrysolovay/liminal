import { Schema as ESchema } from "effect"
import { make } from "effect/Schema"
import { register } from "liminal-schema"

declare module "liminal-schema" {
  interface LTypes {
    [EffectSchema]: EffectSchema
  }
  interface LStatics<_X> {
    [EffectSchema]: (schema: _X) => _X extends EffectSchema<infer T> ? T : never
  }
}

export declare const EffectSchema: unique symbol

export type EffectSchema<T = any> = ESchema.Schema<T, any, never>

register((type: unknown) => {
  if (ESchema.isSchema(type)) {
    return make(type.ast)
  }
  return
})
