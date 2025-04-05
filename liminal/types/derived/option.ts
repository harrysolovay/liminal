import { type JSONNullType, null as null_ } from "../null.ts"
import type { Type } from "../Type.ts"
import type { NormalizeTypeLikeJ, NormalizeTypeLikeT, TypeLike } from "../TypeLike.ts"
import { _union, type JSONUnionType, union } from "../union.ts"

export function option<const X extends TypeLike>(
  of: X,
): Type<null | NormalizeTypeLikeT<X>, JSONUnionType<JSONNullType | NormalizeTypeLikeJ<X>>> {
  return union(null_, of)
}
