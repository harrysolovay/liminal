import { Schema as ESchema } from "effect"
import { make } from "effect/Schema"
import { register } from "liminal-schema"
import { json } from "liminal-util"

declare module "liminal-schema" {
  interface LTypes<_T> {
    [EffectSchema]: EffectSchema<_T>
  }
}

type EffectSchema<O> = {
  readonly [x in ESchema.TypeId]: {
    readonly _A: (_: O) => O
    readonly _I: (_: never) => json.ValueObject
    readonly _R: (_: never) => never
  }
}

export declare const EffectSchema: unique symbol

register({
  test(type) {
    return ESchema.isSchema(type)
  },
  schema(type) {
    return make((type as any).ast)
  },
  async validate(type, value) {
    return ESchema.decodeSync(type as never)(value)
  },
})
