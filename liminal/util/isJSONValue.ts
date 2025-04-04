import type { JSONValue } from "./JSONValue.ts"

export function isJSONValue(value: unknown): value is JSONValue {
  if (value === null) {
    return true
  }

  if (Array.isArray(value)) {
    return value.every((item) => isJSONValue(item))
  }

  if (typeof value === "object") {
    if (value === null) {
      return true
    }
    return Object.values(value).every((v) => isJSONValue(v))
  }

  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
}
