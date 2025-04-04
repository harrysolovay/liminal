import type { JSONObjectType } from "../_object.ts"
import type { JSONConstType } from "../const.ts"
import type { JSONStringType } from "../string.ts"
import { type Type } from "../Type.ts"
import { type JSONUnionType, union } from "../union.ts"
import { type NormalizeObjectValueJ, type NormalizeObjectValueT, object, type ObjectFieldValue } from "./object.ts"

export function taggedUnion<const M extends TaggedUnionMembers, K extends Extract<keyof M, string>>(members: M): Type<
  {
    [L in K]: {
      key: L
      value: NormalizeObjectValueT<M[L]>
    }
  }[K],
  JSONUnionType<
    {
      [L in K]: JSONObjectType<{
        key: JSONConstType<JSONStringType, L>
        value: NormalizeObjectValueJ<M[L]>
      }>
    }[K]
  >
> {
  return union(
    ...Object.entries(members).map(([key, value]) => object({ key, value })),
  ) as never
}

export type TaggedUnionMembers = Record<string, ObjectFieldValue>
