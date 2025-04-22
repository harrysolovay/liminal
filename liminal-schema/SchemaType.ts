import type { SchemaArray } from "./SchemaArray.ts"
import type { SchemaBoolean } from "./SchemaBoolean.ts"
import type { SchemaInteger } from "./SchemaInteger.ts"
import type { SchemaNull } from "./SchemaNull.ts"
import type { SchemaNumber } from "./SchemaNumber.ts"
import type { SchemaObject } from "./SchemaObject.ts"
import type { SchemaString } from "./SchemaString.ts"

export type SchemaType =
  | SchemaNull
  | SchemaBoolean
  | SchemaInteger
  | SchemaNumber
  | SchemaString
  | SchemaArray
  | SchemaObject
