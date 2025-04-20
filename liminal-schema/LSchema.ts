import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { JSON } from "liminal-util"
import type { LJSONSchemaObject } from "./LJSON/LJSONSchemaObject.ts"

export interface LSchema<T = any> extends LJSONSchemaObject<T>, StandardSchemaV1<JSON.JSONValueObject, T> {}
