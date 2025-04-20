import { assert } from "../assert.ts"
import type { JSONValue } from "./JSONValue.ts"

export function assertValue(value: unknown): asserts value is JSONValue {
  if (value === null) {
    return
  } else if (Array.isArray(value)) {
    value.every(assertValue)
  } else if (typeof value === "object") {
    Object.values(value).every(assertValue)
  } else {
    assert(typeof value === "string" || typeof value === "number" || typeof value === "boolean")
  }
}
