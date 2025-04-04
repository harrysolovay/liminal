import type { JSONObjectType } from "./_object.ts"
import type { JSONArrayType } from "./array.ts"
import type { JSONBooleanType } from "./boolean.ts"
import type { JSONConstType } from "./const.ts"
import type { JSONEnumType } from "./enum.ts"
import type { JSONIntegerType } from "./integer.ts"
import type { JSONNullType } from "./null.ts"
import type { JSONNumberType } from "./number.ts"
import type { JSONRefType } from "./ref.ts"
import type { JSONStringType } from "./string.ts"
import type { JSONUnionType } from "./union.ts"

export type JSONIdentifiedType = JSONArrayType | JSONObjectType | JSONUnionType

export type JSONAnonymousType =
  | JSONNullType
  | JSONBooleanType
  | JSONIntegerType
  | JSONNumberType
  | JSONStringType
  | JSONEnumType

export type ConstableType = JSONAnonymousType | JSONIdentifiedType

export type JSONRootableType = ConstableType | JSONConstType

export type JSONType = JSONRootableType | JSONRefType
