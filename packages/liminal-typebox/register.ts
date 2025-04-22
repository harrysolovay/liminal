import { Kind, type TSchema } from "@sinclair/typebox"
import Ajv, { type ValidateFunction } from "ajv"
import { type LType, register } from "liminal-schema"
import { assert } from "liminal-util"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalTypebox]: LiminalTypebox
  }
  interface LStatics<_X extends LType> {
    [LiminalTypebox]: _X extends LiminalTypebox<infer T> ? T : never
  }
}

export declare const LiminalTypebox: unique symbol

export type LiminalTypebox<T = any> = TSchema & { static: T }

const ajv = new Ajv()
const validatorsMemo = new WeakMap<TSchema, ValidateFunction>()

register({
  test(type) {
    return typeof type === "object" && type !== null && Kind in type
  },
  toJSON(type) {
    return type
  },
  async validate(type, value) {
    let validate = validatorsMemo.get(type)
    if (!validate) {
      validate = ajv.compile(type)
      validatorsMemo.set(type, validate)
    }
    assert(validate(value))
    return value
  },
})
