import type { StandardSchemaV1 } from "@standard-schema/spec"
import { JSON } from "liminal-util"
import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaArray<T = any> extends StandardSchemaV1<Array<JSON.JSONValue>, T> {
  type: "array"
  items: LJSONSchema
}
