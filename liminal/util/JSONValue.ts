import { LiminalAssertionError } from "liminal"

export type JSONValue = null | boolean | number | string | JSONValueArray | JSONValueObject
export namespace JSONValue {
  export function assert(value: unknown): asserts value is JSONValue {
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

export type JSONValueArray = Array<JSONValue>

export type JSONValueObject = { [key: string]: JSONValue }
