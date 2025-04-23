export type Schema = SchemaType | SchemaAnyOf

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
