import { type Out, Type } from "arktype"
import { type LType, register } from "liminal-schema"

declare module "liminal-schema" {
  interface LTypes<_T> {
    [LiminalArktype]: Type<_T> | Type<(In: any) => Out<_T>, {}>
  }
}

export declare const LiminalArktype: unique symbol

register({
  test(type) {
    return type instanceof Type
  },
  schema(type) {
    return type.toJsonSchema()
  },
  async validate(type, value) {
    return type.assert(value)
  },
})
