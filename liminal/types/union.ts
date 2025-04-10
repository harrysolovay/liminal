import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"
import { normalizeTypeLike, type NormalizeTypeLikeJ, type NormalizeTypeLikeT, type TypeLike } from "./TypeLike.ts"

export function union<const M extends Array<TypeLike>>(
  ...members: M
): Type<NormalizeTypeLikeT<M[number]>, JSONUnionType<NormalizeTypeLikeJ<M[number]>>> {
  return _union(...members.map(normalizeTypeLike)) as never
}

export function _union(...members: Array<Type>): Type {
  return makeType(() => _union, members)
}

export interface JSONUnionType<M extends JSONType = any> extends JSONTypeBase {
  anyOf: Array<M>
}
