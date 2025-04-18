import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { JSONValue } from "./JSON/JSONValue.ts"
import type { LJSONSchemaObject } from "./LJSON/LJSONSchemaObject.ts"

export interface LSchema<O = any, I extends JSONValue = JSONValue> extends LJSONSchemaObject, StandardSchemaV1<I, O> {}
