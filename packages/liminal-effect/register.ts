import { Schema as ESchema } from "effect"
import { make } from "effect/Schema"
import { type LType, register } from "liminal-schema"

declare module "liminal-schema" {
  interface LTypes {
    [EffectSchema]: EffectSchema
  }
  interface LStatics<_X extends LType> {
    [EffectSchema]: _X extends EffectSchema<infer T> ? T : never
  }
}

export declare const EffectSchema: unique symbol

export type EffectSchema<T = any> = ESchema.Schema<T, any, never>

register({
  test(type) {
    return ESchema.isSchema(type)
  },
  toJSON(type) {
    return make(type.ast)
  },
  async validate(type, value) {
    return ESchema.decodeSync(type)(value)
  },
})
