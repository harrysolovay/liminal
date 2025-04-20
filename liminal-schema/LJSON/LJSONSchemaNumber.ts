import type { StandardSchemaV1 } from "@standard-schema/spec"

export interface LJSONSchemaNumber<T = any> extends StandardSchemaV1<number, T> {
  type: "number"
}
