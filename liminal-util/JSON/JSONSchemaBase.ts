import type { JSONSchema } from "./JSONSchema"
import type { JSONSchemaTypeName } from "./JSONSchemaTypeName.ts"

export type JSONSchemaBase<K extends keyof JSONSchemaDiscriminatedFields> =
  & { [K2 in keyof Pick<JSONSchemaDiscriminatedFields, K>]: JSONSchemaDiscriminatedFields[K2] }
  & { [K2 in keyof Omit<JSONSchemaDiscriminatedFields, K>]+?: never }
  & {
    $schema?: string
    $id?: string
    $defs?: Record<string, JSONSchema>
    title?: string
    description?: string
    default?: unknown
    examples?: Array<unknown>
  }

export type JSONSchemaDiscriminatedFields = {
  type: JSONSchemaTypeName | Array<JSONSchemaTypeName>
  anyOf: Array<JSONSchema>
  allOf: Array<JSONSchema>
  oneOf: Array<JSONSchema>
  $ref: string
}
