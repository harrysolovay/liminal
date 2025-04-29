import { LiminalAssertionError as LE } from "../LiminalAssertionError.ts"
import type { Schema, SchemaObject, SchemaTypeName } from "./Schema.ts"

export function validateSchemaRoot(value: unknown): SchemaObject {
  LE.assert(typeof value === "object")
  LE.assert(value !== null)
  if ("$schema" in value) {
    delete value.$schema
  }
  LE.assert("type" in value)
  LE.assert(value.type === "object")
  return validateSchema(value) as SchemaObject
}

export function validateSchema(value: unknown): Schema {
  LE.assert(typeof value === "object")
  LE.assert(value !== null)
  if ("anyOf" in value) {
    LE.assert(Array.isArray(value.anyOf))
    value.anyOf = value.anyOf.map(validateSchema)
  } else {
    if ("enum" in value) {
      LE.assert(Array.isArray(value.enum))
      LE.assert(!("const" in value))
      value.enum.forEach((v) => {
        LE.assert(typeof v === "string")
      })
      ;(value as any).type = "string"
    } else if ("const" in value) {
      LE.assert(typeof value.const === "string")
      ;(value as any).type = "string"
    }
    LE.assert("type" in value)
    LE.assert(typeof value.type === "string")
    LE.assert(isJSONTypeName(value.type))
    switch (value.type) {
      case "null":
      case "boolean":
      case "integer":
      case "number": {
        break
      }
      case "string": {
        if ("const" in value) {
          LE.assert(typeof value.const === "string")
        }
        break
      }
      case "array": {
        LE.assert("items" in value)
        validateSchema(value.items)
        break
      }
      case "object": {
        LE.assert("properties" in value)
        LE.assert(typeof value.properties === "object")
        const { properties } = value
        LE.assert(properties !== null)
        LE.assert("required" in value)
        LE.assert(Array.isArray(value.required))
        value.required.forEach((k) => {
          LE.assert(typeof k === "string")
          LE.assert(k in properties)
        })
        if ("additionalProperties" in value) {
          LE.assert(value.additionalProperties === false)
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
