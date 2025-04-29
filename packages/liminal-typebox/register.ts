import { Kind, type TSchema } from "@sinclair/typebox"
import Ajv, { type ValidateFunction } from "ajv"
import { LiminalAssertionError } from "liminal"
import { register } from "liminal"

declare module "liminal" {
  interface LTypes<_T> {
    [LiminalTypebox]: TSchema & { static: _T }
  }
}

export declare const LiminalTypebox: unique symbol

const ajv = new Ajv()
const validatorsMemo = new WeakMap<TSchema, ValidateFunction>()

register({
  test(type) {
    return typeof type === "object" && type !== null && Kind in type
  },
  schema(type) {
    return type
  },
  async validate(type, value) {
    let validate = validatorsMemo.get(type)
    if (!validate) {
      validate = ajv.compile(type)
      validatorsMemo.set(type, validate)
    }
    LiminalAssertionError.assert(validate(value))
    return value
  },
})
