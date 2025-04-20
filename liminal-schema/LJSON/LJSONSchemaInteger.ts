import type { StandardSchemaV1 } from "@standard-schema/spec"

export interface LJSONSchemaInteger<T = any> extends StandardSchemaV1<number, T> {
  type: "integer"
}
