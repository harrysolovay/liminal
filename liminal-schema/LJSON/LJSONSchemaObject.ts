import type { StandardSchemaV1 } from "@standard-schema/spec"
import { JSON } from "liminal-util"
import type { LJSONSchema } from "./LJSONSchema.ts"

export interface LJSONSchemaObject<T = any> extends StandardSchemaV1<JSON.JSONValueObject, T> {
  type: "object"
  properties: Record<string, LJSONSchema>
  required: Array<string>
  additionalProperties?: false
}
