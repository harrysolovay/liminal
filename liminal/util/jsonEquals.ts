import type { JSONValue } from "./JSONValue"

export function jsonEquals(actual: JSONValue, expected: JSONValue): boolean {
  if (actual === expected) {
    return true
  }

  if (typeof actual !== typeof expected) {
    return false
  }

  if (actual === null || expected === null) {
    return actual === expected
  }

  if (Array.isArray(actual)) {
    if (!Array.isArray(expected)) {
      return false
    }
    if (actual.length !== expected.length) {
      return false
    }
    return actual.every((e, i) => jsonEquals(e, expected[i]!))
  }

  if (typeof actual === "object") {
    if (typeof expected !== "object" || Array.isArray(expected)) {
      return false
    }
    const keys = Object.keys(actual)
    if (keys.length !== Object.keys(expected).length) {
      return false
    }
    return keys.every((key) =>
      Object.prototype.hasOwnProperty.call(expected, key)
      && jsonEquals(actual[key]!, expected[key]!)
    )
  }

  return actual === expected
}
