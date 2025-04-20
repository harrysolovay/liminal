import type { StandardSchemaV1 } from "@standard-schema/spec"
import { JSON } from "liminal-util"
import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaAnyOf<T = any> extends StandardSchemaV1<JSON.JSONValue, T> {
  anyOf: Array<LJSONSchema>
}
