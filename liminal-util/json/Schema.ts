import type { SchemaAllOf } from "./SchemaAllOf.ts"
import type { SchemaAnyOf } from "./SchemaAnyOf.ts"
import type { SchemaArray } from "./SchemaArray.ts"
import type { SchemaBoolean } from "./SchemaBoolean.ts"
import type { SchemaInteger } from "./SchemaInteger.ts"
import type { SchemaNot } from "./SchemaNot.ts"
import type { SchemaNull } from "./SchemaNull.ts"
import type { SchemaNumber } from "./SchemaNumber.ts"
import type { SchemaObject } from "./SchemaObject.ts"
import type { SchemaOneOf } from "./SchemaOneOf.ts"
import type { SchemaRef } from "./SchemaRef.ts"
import type { SchemaString } from "./SchemaString.ts"

export type Schema =
  | boolean
  | SchemaNull
  | SchemaBoolean
  | SchemaInteger
  | SchemaNumber
  | SchemaString
  | SchemaArray
  | SchemaObject
  | SchemaRef
  | SchemaNot
  | SchemaAnyOf
  | SchemaOneOf
  | SchemaAllOf
