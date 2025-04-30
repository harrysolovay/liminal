import { subtle } from "node:crypto"
import { LiminalAssertionError as LE } from "./LiminalAssertionError.ts"

export type Schema<T = any> = SchemaType<T> | SchemaAnyOf<T>

export type SchemaType<T = any> =
  | SchemaNull<T>
  | SchemaBoolean<T>
  | SchemaInteger<T>
  | SchemaNumber<T>
  | SchemaString<T>
  | SchemaArray<T>
  | SchemaObject<T>

export interface SchemaNull<T = any> extends SchemaTypeBase<"null", T> {}

export interface SchemaBoolean<T = any> extends SchemaTypeBase<"boolean", T> {}

export interface SchemaInteger<T = any> extends SchemaTypeBase<"integer", T> {}

export interface SchemaNumber<T = any> extends SchemaTypeBase<"number", T> {}

export interface SchemaString<T = any> extends SchemaTypeBase<"string", T> {
  enum?: Array<string>
  const?: string
}

export interface SchemaArray<T = any> extends SchemaTypeBase<"array", T> {
  items: Schema
}

export interface SchemaObject<T = any> extends SchemaTypeBase<"object", T> {
  properties: Record<string, Schema>
  required: Array<string>
  additionalProperties: false
}

interface SchemaTypeBase<K extends SchemaTypeName, T> extends SchemaBase<T> {
  type: K
  anyOf?: never
}

export type SchemaTypeName = "null" | "boolean" | "integer" | "number" | "string" | "array" | "object"

export interface SchemaAnyOf<T = any> extends SchemaBase<T> {
  type?: never
  anyOf: Array<Schema>
}

export interface SchemaBase<T> {
  T: T
  description?: string
}

export namespace Schema {
  const ids = new WeakMap<Schema, Record<string, string>>()
  const schemas = new WeakMap<WeakKey, Schema>()
  const validators = new WeakMap<Schema, (value: unknown) => Promise<unknown>>()

  export function compile<T>(key: WeakKey, {
    schema: schema_,
    validate,
  }: {
    schema(): unknown
    validate(value: unknown): Promise<T>
  }) {
    let schema = schemas.get(key)
    if (!schema) {
      schema = Schema.validate(schema_())
      schemas.set(key, schema)
    }
    validators.set(schema, validate)
    return schema
  }

  export async function validateValue<T>(schema: Schema<T>, value: unknown): Promise<T> {
    const validator = validators.get(schema)
    LE.assert(validator)
    return await validator(value) as never
  }

  export async function id(schema: Schema, description?: string): Promise<string> {
    description = description ?? ""
    if (!ids.has(schema)) {
      ids.set(schema, {})
    }
    const schemaIds = ids.get(schema)!
    let id = schemaIds[description]
    if (!id) {
      const content = `${description}_${JSON.stringify(schema)}`
      const bytes = new Uint8Array(await subtle.digest("SHA-256", new TextEncoder().encode(content)))
      let binary = ""
      for (const b of bytes) binary += String.fromCharCode(b)
      id = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
      schemaIds[description] = id
    }
    return id
  }

  export function wrap(schema: Schema): SchemaObject {
    return {
      type: "object",
      properties: { value: schema },
      additionalProperties: false,
      required: ["value"],
    } satisfies Omit<SchemaObject, "T"> as never
  }

  export function validate(value: unknown): Schema {
    LE.assert(typeof value === "object")
    LE.assert(value !== null)
    if ("anyOf" in value) {
      LE.assert(Array.isArray(value.anyOf))
      return {
        anyOf: value.anyOf.map(validate),
      } satisfies Omit<SchemaAnyOf, "T"> as never
    } else {
      if ("enum" in value) {
        LE.assert(Array.isArray(value.enum))
        LE.assert(!("const" in value))
        value.enum.forEach((v) => LE.assert(typeof v === "string"))
        return {
          type: "string",
          enum: value.enum,
        } satisfies Omit<SchemaString, "T"> as never
      } else if ("const" in value) {
        LE.assert(typeof value.const === "string")
        return {
          type: "string",
          const: value.const,
        } satisfies Omit<SchemaString, "T"> as never
      } else if ("type" in value) {
        LE.assert("type" in value)
        LE.assert(typeof value.type === "string")
        LE.assert(SCHEMA_TYPE_NAMES[value.type])
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
            return {
              type: "array",
              items: validate(value.items),
            } satisfies Omit<SchemaArray, "T"> as never
          }
          case "object": {
            LE.assert("properties" in value)
            LE.assert(typeof value.properties === "object")
            const { properties } = value
            LE.assert(properties !== null)
            return {
              type: "object",
              properties: Object.fromEntries(
                Object.entries(properties).map(([key, value]) => [key, validate(value)]),
              ),
              required: Object.keys(properties),
              additionalProperties: false,
            } satisfies Omit<SchemaObject, "T"> as never
          }
        }
      }
    }
    return value as Schema
  }
}

const SCHEMA_TYPE_NAMES: Record<string, boolean> = {
  null: true,
  boolean: true,
  integer: true,
  number: true,
  string: true,
  array: true,
  object: true,
} satisfies Record<SchemaTypeName, true>
