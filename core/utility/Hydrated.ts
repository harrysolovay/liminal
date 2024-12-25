import * as I from "../intrinsics.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function Hydrated(type: JSONType): Type<unknown> {
  const types: Record<string, undefined | Type<unknown>> = {}
  return visit(type) as never

  function visit(type: JSONType) {
    const initial = ((): Type<unknown> => {
      if ("$defs" in type && type.$defs) {
        Object.entries(type.$defs).forEach(([id, jsonType]) => {
          if (!(id in types)) {
            types[id] = undefined
            types[id] = visit(jsonType)
          }
        })
      }
      if ("$ref" in type) {
        const id = type.$ref.split("#/$defs/").pop()!
        return I.f(() => types[id]!)
      } else if ("anyOf" in type) {
        return I.union(...type.anyOf.map(visit))
      }
      switch (type.type) {
        case "null": {
          return I.null
        }
        case "boolean": {
          return I.boolean
        }
        case "integer": {
          return I.integer
        }
        case "number": {
          return I.number
        }
        case "string": {
          return type.enum ? I.enum(...type.enum) : I.string
        }
        case "array": {
          return I.array(visit(type.items))
        }
        case "object": {
          return I.object(
            Object.fromEntries(Object.entries(type.properties).map(([k, v]) => [k, visit(v)])),
          )
        }
      }
    })()(type.description)
    return type.const ? I.const(initial, type.const) : initial
  }
}
