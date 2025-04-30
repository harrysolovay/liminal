import { type TSchema } from "@sinclair/typebox"
import Ajv, { type ValidateFunction } from "ajv"
import { LiminalAssertionError, Schema } from "liminal"

const ajv = new Ajv()
const ajvMemo = new WeakMap<TSchema, ValidateFunction>()

export function compile<T>(type: TSchema & { static: T }): Schema<T> {
  return Schema.compile(type, {
    schema() {
      return type
    },
    async validate(value) {
      let validate = ajvMemo.get(type)
      if (!validate) {
        validate = ajv.compile(type)
        ajvMemo.set(type, validate)
      }
      LiminalAssertionError.assert(validate(value))
      return value
    },
  })
}
