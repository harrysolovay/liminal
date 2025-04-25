import { assert } from "liminal-util"
import type { Schema, SchemaObject, SchemaTypeName } from "./Schema.ts"
import { Value } from "./Value.ts"

export function validateSchemaRoot(value: unknown): SchemaObject {
  assert(typeof value === "object")
  assert(value !== null)
  if ("$schema" in value) {
    delete value.$schema
  }
  assert("type" in value)
  assert(value.type === "object")
  return validateSchema(value) as SchemaObject
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
    if ("enum" in value) {
      assert(Array.isArray(value.enum))
      assert(!("const" in value))
      value.enum.forEach((v) => {
        assert(typeof v === "string")
      })
      ;(value as any).type = "string"
    } else if ("const" in value) {
      assert(typeof value.const === "string")
      ;(value as any).type = "string"
    }
    assert("type" in value)
    assert(typeof value.type === "string")
    assert(isJSONTypeName(value.type))
    switch (value.type) {
      case "null":
      case "boolean":
      case "integer":
      case "number": {
        break
      }
      case "string": {
        if ("const" in value) {
          assert(typeof value.const === "string")
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

function isJSONTypeName(value: string): value is SchemaTypeName {
  return !!({
    null: true,
    boolean: true,
    integer: true,
    number: true,
    string: true,
    array: true,
    object: true,
  } as Record<string, boolean>)[value]
}
