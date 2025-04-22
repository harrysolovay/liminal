import { type Out, Type } from "arktype"
import { register } from "liminal-schema"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalArktype]: LiminalArktype
  }
  interface LStatics<_X> {
    [LiminalArktype]: (schema: _X) => _X extends LiminalArktype<infer T> ? T : never
  }
}

export declare const LiminalArktype: unique symbol
export type LiminalArktype<O = any> = Type<O> | Type<(In: any) => Out<O>, {}>

register((type: unknown) => {
  if (type instanceof Type) {
    return type.toJsonSchema()
  }
  return
})
