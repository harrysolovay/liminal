import type { JSONSchemaAllOf } from "./JSONSchemaAllOf.ts"
import type { JSONSchemaAnyOf } from "./JSONSchemaAnyOf.ts"
import type { JSONSchemaArray } from "./JSONSchemaArray.ts"
import type { JSONSchemaBoolean } from "./JSONSchemaBoolean.ts"
import type { JSONSchemaInteger } from "./JSONSchemaInteger.ts"
import type { JSONSchemaNot } from "./JSONSchemaNot.ts"
import type { JSONSchemaNull } from "./JSONSchemaNull.ts"
import type { JSONSchemaNumber } from "./JSONSchemaNumber.ts"
import type { JSONSchemaObject } from "./JSONSchemaObject.ts"
import type { JSONSchemaOneOf } from "./JSONSchemaOneOf.ts"
import type { JSONSchemaRef } from "./JSONSchemaRef.ts"
import type { JSONSchemaString } from "./JSONSchemaString.ts"

export type JSONSchema =
  | boolean
  | JSONSchemaNull
  | JSONSchemaBoolean
  | JSONSchemaInteger
  | JSONSchemaNumber
  | JSONSchemaString
  | JSONSchemaArray
  | JSONSchemaObject
  | JSONSchemaRef
  | JSONSchemaNot
  | JSONSchemaAnyOf
  | JSONSchemaOneOf
  | JSONSchemaAllOf
