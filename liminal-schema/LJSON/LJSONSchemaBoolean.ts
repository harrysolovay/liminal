import type { StandardSchemaV1 } from "@standard-schema/spec"

export interface LJSONSchemaBoolean<T = any> extends StandardSchemaV1<boolean, T> {
  type: "boolean"
}
