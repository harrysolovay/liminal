import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { JSON } from "liminal-util"
import type { SchemaObject } from "./SchemaObject.ts"

export interface SchemaRoot<T = any> extends SchemaObject, StandardSchemaV1<JSON.ValueObject, T> {
  T: T
}
