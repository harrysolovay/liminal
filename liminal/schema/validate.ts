import { assert } from "../util/assert.ts"
import { assertValue } from "../util/JSON/assertJSONValue.ts"
import { assertTypeName } from "../util/JSON/JSONSchemaTypeName.ts"
import type { Schema } from "./Schema.ts"
import type { SchemaRoot } from "./SchemaRoot.ts"

export function validateSchemaRoot(value: unknown): SchemaRoot {
  assert(typeof value === "object")
  assert(value !== null)
  assert("type" in value)
  assert(typeof value.type === "object")
  return validateSchema(value) as SchemaRoot
}

export function validateSchema(value: unknown): Schema {
  assert(typeof value === "object")
  assert(value !== null)
  if ("anyOf" in value) {
    assert(Array.isArray(value.anyOf))
    value.anyOf.forEach((v) => {
      validateSchema(v)
    })
  } else {
    assert("type" in value)
    assert(typeof value.type === "string")
    assertTypeName(value.type)
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
          assertValue(value.const)
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
        validateSchema(value.items)
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
        Object.values(properties).forEach(validateSchema)
      }
    }
  }
  return value as Schema
}
