import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { JSONValueObject } from "../util/JSON/JSONValueObject.ts"
import type { SchemaObject } from "./SchemaObject.ts"

export interface SchemaRoot<T = any> extends SchemaObject, StandardSchemaV1<JSONValueObject, T> {
  T: T
}
