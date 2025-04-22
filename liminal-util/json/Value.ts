import type { ValueArray } from "./ValueArray.ts"
import type { ValueObject } from "./ValueObject.ts"

export type Value = null | boolean | number | string | ValueArray | ValueObject
