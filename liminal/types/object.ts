import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import { type Type } from "./Type.ts"
import { normalizeTypeLikes, type NormalizeTypeLikesJ, type NormalizeTypeLikesT, type TypeLikes } from "./TypeLike.ts"

export function object<const F extends TypeLikes>(
  fields: F,
): Type<NormalizeTypeLikesT<F>, JSONObjectType<NormalizeTypeLikesJ<F>>> {
  return normalizeTypeLikes(fields) as never
}

export function _object(fields: ObjectFields): Type {
  return makeType(() => _object, [fields])
}

export interface JSONObjectType<F extends Record<JSONKey, JSONType> = any> extends JSONTypeBase {
  type: "object"
  properties: F
  required: Array<keyof F>
  additionalProperties: false
}

export type ObjectFields = TupleFields | RecordFields
export type TupleFields = Array<Type>
export type RecordFields = Record<JSONKey, Type>
