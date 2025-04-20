import type { JSONValueArray } from "./JSONValueArray.ts"
import type { JSONValueObject } from "./JSONValueObject.ts"

export type JSONValue = null | boolean | number | string | JSONValueArray | JSONValueObject
