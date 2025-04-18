import { assert } from "liminal-util"
import { assertJSONSchemaTypeName } from "./JSON/JSONSchemaTypeName.ts"
import { assertJSONValue } from "./JSON/JSONValue.ts"

export function assertLSchema(value: unknown): asserts value is object {
  assert(typeof value === "object")
  assert(value !== null)
  if ("anyOf" in value) {
    assert(Array.isArray(value.anyOf))
    value.anyOf.forEach((v) => {
      assertLSchema(v)
    })
  } else {
    assert("type" in value)
    assert(typeof value.type === "string")
    assertJSONSchemaTypeName(value.type)
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
          assertJSONValue(value.const)
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
        assertLSchema(value.items)
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
        assert("additionalProperties" in value)
        assert(value.additionalProperties === false)
        Object.values(properties).forEach(assertLSchema)
      }
    }
  }
}
