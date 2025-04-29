import { LiminalAssertionError } from "liminal"

export type Value = null | boolean | number | string | ValueArray | ValueObject
export namespace Value {
  export function assert(value: unknown): asserts value is Value {
    if (value === null) {
      return
    } else if (Array.isArray(value)) {
      value.every(assert)
    } else if (typeof value === "object") {
      Object.values(value).every(assert)
    } else {
      LiminalAssertionError.assert(typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    }
  }
}

export type ValueArray = Array<Value>

export type ValueObject = { [key: string]: Value }
