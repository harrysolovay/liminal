import { assert, JSON } from "liminal-util"
import type { LSchema } from "./LSchema"

export function ensureLSchema(value: unknown): LSchema {
  assert(typeof value === "object")
  assert(value !== null)
  if ("anyOf" in value) {
    assert(Array.isArray(value.anyOf))
    value.anyOf.forEach((v) => {
      ensureLSchema(v)
    })
  } else {
    assert("type" in value)
    assert(typeof value.type === "string")
    JSON.assertTypeName(value.type)
    switch (value.type) {
      case "null":
      case "boolean":
      case "integer":
      case "number": {
        break
      }
      case "string": {
        assert(!("const" in value && "enum" in value))
        if ("const" in value) {
          JSON.assertValue(value.const)
        }
        if ("enum" in value) {
          assert(Array.isArray(value.enum))
          value.enum.forEach((v) => {
            assert(typeof v === "string")
          })
        }
        break
      }
      case "array": {
        assert("items" in value)
        ensureLSchema(value.items)
        break
      }
      case "object": {
        assert("properties" in value)
        assert(typeof value.properties === "object")
        const { properties } = value
        assert(properties !== null)
        assert("required" in value)
        assert(Array.isArray(value.required))
        value.required.forEach((k) => {
          assert(typeof k === "string")
          assert(k in properties)
        })
        if ("additionalProperties" in value) {
          assert(value.additionalProperties === false)
        } else {
          ;(value as any).additionalProperties = false
        }
        Object.values(properties).forEach(ensureLSchema)
      }
    }
  }
  return value as LSchema
}
