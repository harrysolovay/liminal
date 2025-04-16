export declare namespace JSON {
  export type Value = null | boolean | number | string | Array<Value> | {
    [value: string]: Value
  }

  export type Schema = SchemaType | SchemaAny | SchemaAnyOf | SchemaOneOf | SchemaRef

  export type SchemaType =
    | SchemaNullType
    | SchemaBooleanType
    | SchemaIntegerType
    | SchemaNumberType
    | SchemaStringType
    | SchemaArrayType
    | SchemaObjectType

  export interface SchemaNullType extends SchemaTypeBase<"null"> {}
  export interface SchemaBooleanType extends SchemaTypeBase<"boolean"> {}
  export interface SchemaIntegerType extends SchemaTypeBase<"integer"> {}
  export interface SchemaNumberType extends SchemaTypeBase<"number"> {
    enum?: Array<number>
  }
  export interface SchemaStringType extends SchemaTypeBase<"string"> {
    enum?: Array<string>
  }

  export interface SchemaArrayType extends SchemaTypeBase<"array"> {
    items: Schema
  }
  export interface SchemaObjectType extends SchemaTypeBase<"object"> {
    properties: SchemaRecord
    required: Array<string>
    additionalProperties?: boolean
  }

  interface SchemaTypeBase<K extends string> extends SchemaNonRefCommon {
    type: K
    anyOf?: never
    oneOf?: never
  }

  export type SchemaRecord = Record<string, Schema>

  export interface SchemaAny extends SchemaNonRefCommon {
    type?: never
    anyOf?: never
    oneOf?: never
  }

  export interface SchemaAnyOf extends SchemaNonRefCommon {
    type?: never
    anyOf: Array<Schema>
    oneOf?: never
  }

  export interface SchemaOneOf extends SchemaNonRefCommon {
    type?: never
    anyOf?: never
    oneOf: Array<Schema>
  }

  interface SchemaNonRefCommon {
    $ref?: never
    const?: Value
    description?: string
    $defs?: SchemaRecord
    title?: string
    examples?: Array<Value>
    default?: Value
  }

  export interface SchemaRef {
    $ref: string
    anyOf?: never
    oneOf?: never
    type?: never
    const?: never
    description?: never
    $defs?: SchemaRecord
  }
}
