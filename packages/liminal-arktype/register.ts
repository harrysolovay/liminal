import { type Out, Type } from "arktype"
import { type LType, register } from "liminal-schema"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalArktype]: LiminalArktype
  }
  interface LStatics<_X extends LType> {
    [LiminalArktype]: _X extends LiminalArktype<infer T> ? T : never
  }
}

export declare const LiminalArktype: unique symbol
export type LiminalArktype<O = any> = Type<O> | Type<(In: any) => Out<O>, {}>

register({
  test(type) {
    return type instanceof Type
  },
  toJSON(type) {
    return type.toJsonSchema()
  },
  async validate(type, value) {
    return type.assert(value)
  },
})
