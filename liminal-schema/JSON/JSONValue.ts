import { assert } from "liminal-util"

export type JSONValue = null | boolean | number | string | Array<JSONValue> | { [value: string]: JSONValue }

export function assertJSONValue(value: unknown): asserts value is JSONValue {
  if (value === null) {
    return
  } else if (Array.isArray(value)) {
    value.every(assertJSONValue)
  } else if (typeof value === "object") {
    Object.values(value).every(assertJSONValue)
  } else {
    assert(typeof value === "string" || typeof value === "number" || typeof value === "boolean")
  }
}
