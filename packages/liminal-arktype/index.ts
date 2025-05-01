import type { Out, Type } from "arktype"
import { Schema } from "liminal"

export function compile<T>(type: Type<T> | Type<(In: any) => Out<T>, {}>): Schema<T> {
  return Schema.compile(type, {
    schema() {
      return type.toJsonSchema()
    },
    validate(value) {
      return type.assert(value)
    },
  })
}
