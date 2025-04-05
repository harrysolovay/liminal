import type { Falsy } from "../util/Falsy.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { const as const_, type JSONConstType } from "./const.ts"
import { type JSONNullType, null as null_ } from "./null.ts"
import { type JSONNumberType, number } from "./number.ts"
import { _object, type JSONObjectType } from "./object.ts"
import { type JSONStringType, string } from "./string.ts"
import { isType, type Type } from "./Type.ts"

export type TypeLike = Type | TypeLikes | JSONKey | Falsy
export type TypeLikes = TypeLikeTuple | TypeLikeRecord

export type TypeLikeTuple = Array<TypeLike>
export type TypeLikeRecord = {
  [key: JSONKey]: TypeLike
}

export type NormalizeTypeLikesT<F extends TypeLikes> =
  & {
    -readonly [K in keyof F as F extends TypeLikeTuple ? Exclude<K, keyof Array<any>> : K]: NormalizeTypeLikeT<
      Extract<F[K], TypeLike>
    >
  }
  & {}

export type NormalizeTypeLikeT<V extends TypeLike> = V extends TypeLikes ? NormalizeTypeLikesT<V>
  : V extends JSONKey ? V
  : V extends Type<infer T> ? T
  : null

export type NormalizeTypeLikesJ<F extends TypeLikes> =
  & {
    -readonly [K in keyof F as F extends TypeLikeTuple ? Exclude<K, keyof Array<any>> : K]: NormalizeTypeLikeJ<
      Extract<F[K], TypeLike>
    >
  }
  & {}

export type NormalizeTypeLikeJ<V extends TypeLike> = V extends TypeLikes ? JSONObjectType<NormalizeTypeLikesJ<V>>
  : V extends string ? JSONConstType<JSONStringType, V>
  : V extends number ? JSONConstType<JSONNumberType, V>
  : V extends Type<any, infer J> ? J
  : JSONNullType

export function normalizeTypeLikes(fields: TypeLikes): Type {
  return (Array.isArray(fields)
    ? _object(fields.map(normalizeTypeLike))
    : _object(Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, normalizeTypeLike(v)])))) as never
}

export function normalizeTypeLike(value: TypeLike): Type {
  if (!value) {
    return null_
  }
  if (typeof value === "string") {
    return const_(string, value)
  }
  if (typeof value === "number") {
    return const_(number, value)
  }
  if (isType(value)) {
    return value
  }
  return normalizeTypeLikes(value)
}
