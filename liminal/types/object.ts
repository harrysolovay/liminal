import type { JSONConstType } from "./const.ts"
import { declareType } from "./declareType.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { JSONStringType } from "./string.ts"
import type { Type } from "./Type.ts"

export function object<const F extends ObjectFields>(fields: F): Type<ObjectT<F>, JSONObjectType<ObjectJ<F>>> {
  return declareType(() => object<F>, [
    Array.isArray(fields)
      ? fields
      : Object.fromEntries(Object.keys(fields).toSorted().map((key) => [key, fields[key]])),
  ])
}

export interface JSONObjectType<F extends Record<string, JSONType> = any> extends JSONTypeBase {
  type: "object"
  fields: F
  required: Array<keyof F>
}

export type ObjectFields = TupleFields | RecordFields
export type TupleFields = Array<FieldValue>
export interface RecordFields {
  [key: string]: FieldValue
}
export type FieldValue = Type | ObjectFields | string

export type ObjectT<F extends ObjectFields> = [
  {
    -readonly [K in keyof F]: F[K] extends ObjectFields ? ObjectT<F[K]>
      : F[K] extends string ? F[K]
      : F[K] extends Type<infer T> ? T
      : never
  },
][0]

export type ObjectJ<F extends ObjectFields> = [
  {
    [K in keyof F as F extends TupleFields ? Exclude<K, keyof Array<any>> : K]: F[K] extends ObjectFields
      ? JSONObjectType<ObjectJ<F[K]>>
      : F[K] extends string ? JSONConstType<JSONStringType, F[K]>
      : F[K] extends Type<any, infer J> ? J
      : never
  },
][0]
