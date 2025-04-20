import type { StandardSchemaV1 } from "@standard-schema/spec"

export interface LJSONSchemaString<T = any> extends StandardSchemaV1<string, T> {
  type: "string"
  enum?: Array<string>
  const?: string
}
