import type { Schema } from "./Schema.ts"
import type { SchemaTypeName } from "./SchemaTypeName.ts"

export type JSONSchemaBase<K extends keyof JSONSchemaDiscriminatedFields> =
  & { [K2 in keyof Pick<JSONSchemaDiscriminatedFields, K>]: JSONSchemaDiscriminatedFields[K2] }
  & { [K2 in keyof Omit<JSONSchemaDiscriminatedFields, K>]+?: never }
  & {
    $schema?: string
    $id?: string
    $defs?: Record<string, Schema>
    title?: string
    description?: string
    default?: unknown
    examples?: Array<unknown>
  }

export type JSONSchemaDiscriminatedFields = {
  type: SchemaTypeName | Array<SchemaTypeName>
  anyOf: Array<Schema>
  allOf: Array<Schema>
  oneOf: Array<Schema>
  $ref: string
}
