import { Type } from "./Type.ts"
import { assert } from "./util/assert.ts"

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, { [K in keyof F]: F[K]["O"] }> {
  const keys = Object.keys(fields)
  return Type.declare({
    name: "object",
    factory: object,
    args: [fields],
    assert: (value, path) => {
      assert(typeof value === "object" && value !== null)
      keys.forEach((k) => {
        const field: F[typeof k] = fields[k] as never
        field.declaration.assert((value as never)[k], [...path, k])
      })
    },
    transform: (value) =>
      Object.fromEntries(
        keys.map((k) => [k, fields[k]!.declaration.transform(value[k])]),
      ) as never,
    subschema: (subschema) => ({
      type: "object",
      properties: Object.fromEntries(keys.map((k) => [k, subschema(fields[k]!)])),
      additionalProperties: false,
      required: keys,
    }),
    assertRefinementsValid: () => {},
    assertRefinements: {},
  })
}
