import type { StandardSchemaV1 } from "@standard-schema/spec"

export interface LJSONSchemaNull<T = any> extends StandardSchemaV1<null, T> {
  type: "null"
}
