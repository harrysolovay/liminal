import { assert as assert_ } from "./assert.ts"
import type { Value } from "./Value.ts"

export function assert(value: unknown): asserts value is Value {
  if (value === null) {
    return
  } else if (Array.isArray(value)) {
    value.every(assert)
  } else if (typeof value === "object") {
    Object.values(value).every(assert)
  } else {
    assert_(typeof value === "string" || typeof value === "number" || typeof value === "boolean")
  }
}
