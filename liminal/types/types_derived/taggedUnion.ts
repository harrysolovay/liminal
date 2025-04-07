import type { JSONKey } from "../../util/JSONKey.ts"
import type { JSONConstType } from "../const.ts"
import { type JSONObjectType, object } from "../object.ts"
import type { JSONStringType } from "../string.ts"
import { type Type } from "../Type.ts"
import { type NormalizeTypeLikeJ, type NormalizeTypeLikeT, type TypeLike } from "../TypeLike.ts"
import { _union, type JSONUnionType, union } from "../union.ts"

export function taggedUnion<const M extends TaggedUnionMembers, K extends Extract<keyof M, string>>(members: M): Type<
  {
    [L in K]: {
      type: L
      value: NormalizeTypeLikeT<M[L]>
    }
  }[K],
  JSONUnionType<
    {
      [L in K]: JSONObjectType<{
        type: JSONConstType<JSONStringType, L>
        value: NormalizeTypeLikeJ<M[L]>
      }>
    }[K]
  >
> {
  return union(
    ...Object.entries(members).map(([type, value]) => object({ type, value })),
  ) as never
}

export type TaggedUnionMembers = Record<JSONKey, TypeLike>
