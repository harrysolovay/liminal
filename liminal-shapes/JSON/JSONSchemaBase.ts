import type { JSONSchema } from "./JSONSchema"
import type { JSONSchemaAnnotations } from "./JSONSchemaAnnotations.ts"
import type { JSONSchemaTypeName } from "./JSONSchemaTypeBase.ts"

export type JSONSchemaBase<K extends keyof JSONSchemaDiscriminatedFields> =
  & {
    $schema?: string
    $id?: string
    $defs?: Record<string, JSONSchema>
  }
  & JSONSchemaAnnotations
  & { [K2 in keyof Pick<JSONSchemaDiscriminatedFields, K>]: JSONSchemaDiscriminatedFields[K2] }
  & { [K2 in keyof Omit<JSONSchemaDiscriminatedFields, K>]+?: never }

export type JSONSchemaDiscriminatedFields = {
  type: JSONSchemaTypeName | Array<JSONSchemaTypeName>
  anyOf: Array<JSONSchema>
  allOf: Array<JSONSchema>
  oneOf: Array<JSONSchema>
  $ref: string
}
