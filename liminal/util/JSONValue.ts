import { LiminalAssertionError } from "liminal"

export type JSONValue = null | boolean | number | string | JSONValueArray | JSONValueObject
export namespace JSONValue {
  export function assert(
    value: unknown,
    visited: Set<object> = new Set<object>(),
  ): asserts value is JSONValue {
    if (value === null) return
    const t = typeof value
    if (typeof value !== "object") {
      LiminalAssertionError.assert(t === "string" || t === "number" || t === "boolean")
      return
    }
    LiminalAssertionError.assert(!visited.has(value))
    visited.add(value)
    try {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          assert(value[i], new Set(visited))
        }
      } else {
        for (const key in value) {
          assert(value[key as never], new Set(visited))
        }
      }
    } finally {
      visited.delete(value)
    }
  }
}

export type JSONValueArray = Array<JSONValue>

export type JSONValueObject = { [key: string]: JSONValue }
