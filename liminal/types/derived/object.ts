import type { Falsy } from "../../util/Falsy.ts"
import { _object, type _ObjectFields, type JSONObjectType } from "../_object.ts"
import { const as const_ } from "../const.ts"
import type { JSONConstType } from "../const.ts"
import { type JSONNullType, null as null_ } from "../null.ts"
import type { RootType } from "../RootType.ts"
import { type JSONStringType, string } from "../string.ts"
import { isType, type Type } from "../Type.ts"

export function object<const F extends ObjectFields>(
  fields: F,
): RootType<NormalizeObjectT<F>, JSONObjectType<NormalizeObjectJ<F>>> {
  return normalizeObjectType(fields) as never
}

export type ObjectFields = TupleFields | RecordFields
export type TupleFields = Array<ObjectFieldValue>
export interface RecordFields {
  [key: string]: ObjectFieldValue
}
export type ObjectFieldValue = Type | ObjectFields | string | Falsy

export type NormalizeObjectT<F extends ObjectFields> = [
  { -readonly [K in keyof F]: NormalizeObjectValueT<F[K]> },
][0]

// TODO: `V` constraint
export type NormalizeObjectValueT<V> = V extends ObjectFields ? NormalizeObjectT<V>
  : V extends string ? V
  : V extends Type<infer T> ? T
  : null

export type NormalizeObjectJ<F extends ObjectFields> = [
  { -readonly [K in keyof F as F extends TupleFields ? Exclude<K, keyof Array<any>> : K]: NormalizeObjectValueJ<F[K]> },
][0]

// TODO: `V` constraint
export type NormalizeObjectValueJ<V> = V extends ObjectFields ? JSONObjectType<NormalizeObjectJ<V>>
  : V extends string ? JSONConstType<JSONStringType, V>
  : V extends Type<any, infer J> ? J
  : JSONNullType

export function normalizeObjectValueType(value: ObjectFieldValue): Type {
  if (!value) {
    return null_
  }
  if (typeof value === "string") {
    return const_(string, value)
  }
  if (isType(value)) {
    return value
  }
  return normalizeObjectType(value)
}

export function normalizeObjectType(fields: ObjectFields): Type {
  return (Array.isArray(fields)
    ? _object(fields.map(normalizeObjectValueType))
    : _object(Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, normalizeObjectValueType(v)])))) as never
}
