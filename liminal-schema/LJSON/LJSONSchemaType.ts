import type { LJSONSchemaArray } from "./LJSONSchemaArray.ts"
import type { LJSONSchemaBoolean } from "./LJSONSchemaBoolean.ts"
import type { LJSONSchemaInteger } from "./LJSONSchemaInteger.ts"
import type { LJSONSchemaNull } from "./LJSONSchemaNull.ts"
import type { LJSONSchemaNumber } from "./LJSONSchemaNumber.ts"
import type { LJSONSchemaObject } from "./LJSONSchemaObject.ts"
import type { LJSONSchemaString } from "./LJSONSchemaString.ts"

export type LJSONSchemaType<T = any> =
  | LJSONSchemaNull<T>
  | LJSONSchemaBoolean<T>
  | LJSONSchemaInteger<T>
  | LJSONSchemaNumber<T>
  | LJSONSchemaString<T>
  | LJSONSchemaArray<T>
  | LJSONSchemaObject<T>
