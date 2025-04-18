import { assert } from "liminal-util"
import { assertJSONSchemaTypeName } from "../JSON/JSONSchemaTypeName.ts"
import type { LJSONSchemaArray } from "./LJSONSchemaArray.ts"
import type { LJSONSchemaBoolean } from "./LJSONSchemaBoolean.ts"
import type { LJSONSchemaInteger } from "./LJSONSchemaInteger.ts"
import type { LJSONSchemaNull } from "./LJSONSchemaNull.ts"
import type { LJSONSchemaNumber } from "./LJSONSchemaNumber.ts"
import type { LJSONSchemaObject } from "./LJSONSchemaObject.ts"
import type { LJSONSchemaString } from "./LJSONSchemaString.ts"

export type LJSONSchemaType =
  | LJSONSchemaNull
  | LJSONSchemaBoolean
  | LJSONSchemaInteger
  | LJSONSchemaNumber
  | LJSONSchemaString
  | LJSONSchemaArray
  | LJSONSchemaObject

export function assertLJSONSchemaType(value: object): asserts value is LJSONSchemaType {
  assert("type" in value)
  assert(assertJSONSchemaTypeName(value.type))
}
