import { type Out, Type } from "arktype"
import { register } from "liminal-schema"
import type { json } from "liminal-util"

declare module "liminal-schema" {
  export interface SchemaAdapterRegistry {
    [ArktypeTag]: LiminalArktype
  }
}

export declare const ArktypeTag: unique symbol

export type LiminalArktype = Type<json.ValueObject> | Type<(In: json.ValueObject) => Out<any>>

register<LiminalArktype>({
  match: (type) => type instanceof Type,
  toJSON: (type) => type.toJsonSchema(),
})
