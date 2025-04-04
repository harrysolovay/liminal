import type { Falsy } from "../util/Falsy.ts"
import { const as const_, type JSONConstType } from "./const.ts"
import { type JSONNullType, null as null_ } from "./null.ts"
import { _object, type JSONObjectType } from "./object.ts"
import { type JSONStringType, string } from "./string.ts"
import { isType, type Type } from "./Type.ts"

export type TypeLike = Type | TypeLikes | string | Falsy
export type TypeLikes = TypeLikeTuple | TypeLikeRecord

export type TypeLikeTuple = Array<TypeLike>
export type TypeLikeRecord = {
  [key: string]: TypeLike
}

export type NormalizeTypeLikesT<F extends TypeLikes> = [
  { -readonly [K in keyof F]: NormalizeTypeLikeT<F[K]> },
][0]

// TODO: `V` constraint
export type NormalizeTypeLikeT<V> = V extends TypeLikes ? NormalizeTypeLikesT<V>
  : V extends string ? V
  : V extends Type<infer T> ? T
  : null

export type NormalizeTypeLikesJ<F extends TypeLikes> = [
  { -readonly [K in keyof F as F extends TypeLikeTuple ? Exclude<K, keyof Array<any>> : K]: NormalizeTypeLikeJ<F[K]> },
][0]

// TODO: `V` constraint
export type NormalizeTypeLikeJ<V> = V extends TypeLikes ? JSONObjectType<NormalizeTypeLikesJ<V>>
  : V extends string ? JSONConstType<JSONStringType, V>
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
  if (isType(value)) {
    return value
  }
  return normalizeTypeLikes(value)
}
