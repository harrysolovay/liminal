import type { LJSONSchemaObject } from "./LJSON/LJSONSchemaObject.ts"

export interface LSchema<T = any> extends LJSONSchemaObject<T> {
  T: T
}
