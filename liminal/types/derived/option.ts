import type { JSONValue } from "../../util/JSONValue.ts"
import type { JSONType } from "../JSONType.ts"
import { type JSONNullType, null as null_ } from "../null.ts"
import type { Type } from "../Type.ts"
import { type JSONUnionType, union } from "../union.ts"

export function option<T extends JSONValue, J extends JSONType>(
  of: Type<T, J>,
): Type<T | null, JSONUnionType<J | JSONNullType>> {
  return union(of, null_)
}
