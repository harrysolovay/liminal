import type { Falsy } from "../util/Falsy.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { const as const_, type JSONConstType } from "./const.ts"
import { type JSONNullType, null as null_ } from "./null.ts"
import { _object, type JSONObjectType } from "./object.ts"
import { type JSONStringType, string } from "./string.ts"
import { isType, type Type } from "./Type.ts"

export type TypeLike = Type | TypeLikes | string | Falsy
export type TypeLikes = TypeLikeArray | TypeLikeRecord

export type TypeLikeArray = Array<TypeLike>
export type TypeLikeRecord = {
  [key: JSONKey]: TypeLike
}

export type NormalizeTypeLikesT<F extends TypeLikes> =
  & {
    -readonly [K in keyof F as F extends TypeLikeArray ? Exclude<K, keyof Array<any>> : K]: NormalizeTypeLikeT<
      Extract<F[K], TypeLike>
    >
  }
  & {}

export type NormalizeTypeLikeT<V extends TypeLike> = V extends TypeLikes ? NormalizeTypeLikesT<V>
  : V extends string ? V
  : V extends Type<infer T> ? T
  : null

export type NormalizeTypeLikesJ<F extends TypeLikes> =
  & {
    -readonly [K in keyof F as F extends TypeLikeArray ? Exclude<K, keyof Array<any>> : K]: NormalizeTypeLikeJ<
      Extract<F[K], TypeLike>
    >
  }
  & {}

export type NormalizeTypeLikeJ<V extends TypeLike> = V extends TypeLikes ? JSONObjectType<NormalizeTypeLikesJ<V>>
  : V extends string ? JSONConstType<JSONStringType, V>
  : V extends Type<any, infer J> ? J
  : JSONNullType

export function normalizeTypeLikes(fields: TypeLikes): Type {
  return (Array.isArray(fields)
    ? _object(fields.map(normalizeTypeLike))
    : _object(Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, normalizeTypeLike(v)]))))
}

export function normalizeTypeLike(value: TypeLike): Type {
  if (!value) {
    return null_
  }
  if (typeof value === "string") {
    return const_(string, value)
  }
  if (isType(value)) {
    return value
  }
  return normalizeTypeLikes(value)
}
