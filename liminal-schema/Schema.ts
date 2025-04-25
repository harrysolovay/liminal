import { subtle } from "node:crypto"

export type Schema = SchemaType | SchemaAnyOf

export namespace Schema {
  const ids = new WeakMap<SchemaObject, Record<string, string>>()

  export async function id(schema: SchemaObject, description?: string): Promise<string> {
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
}

export type SchemaType =
  | SchemaNull
  | SchemaBoolean
  | SchemaInteger
  | SchemaNumber
  | SchemaString
  | SchemaArray
  | SchemaObject

export interface SchemaNull extends SchemaTypeBase<"null"> {}

export interface SchemaBoolean extends SchemaTypeBase<"boolean"> {}

export interface SchemaInteger extends SchemaTypeBase<"integer"> {}

export interface SchemaNumber extends SchemaTypeBase<"number"> {}

export interface SchemaString extends SchemaTypeBase<"string"> {
  enum?: Array<string>
  const?: string
}

export interface SchemaArray extends SchemaTypeBase<"array"> {
  items: Schema
}

export interface SchemaObject extends SchemaTypeBase<"object"> {
  properties: Record<string, Schema>
  required: Array<string>
  additionalProperties: false
}

export interface SchemaTypeBase<K extends SchemaTypeName> extends SchemaBase {
  type: K
  anyOf?: never
}

export type SchemaTypeName = "null" | "boolean" | "integer" | "number" | "string" | "array" | "object"

export interface SchemaAnyOf extends SchemaBase {
  type?: never
  anyOf: Array<Schema>
}

export interface SchemaBase {
  description?: string
}
