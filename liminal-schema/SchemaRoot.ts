import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { json } from "liminal-util"
import type { SchemaObject } from "./SchemaObject.ts"

export interface SchemaRoot<T = any> extends SchemaObject, StandardSchemaV1<json.ValueObject, T> {
  T: T
}
