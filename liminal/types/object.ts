import { infer } from "../actions/Infer.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { declareType } from "./declareType.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { RootType } from "./RootType.ts"
import { type Type } from "./Type.ts"
import { normalizeTypeLikes, type NormalizeTypeLikesJ, type NormalizeTypeLikesT, type TypeLikes } from "./TypeLike.ts"

export function object<const F extends TypeLikes>(
  fields: F,
): RootType<NormalizeTypeLikesT<F>, JSONObjectType<NormalizeTypeLikesJ<F>>> {
  return normalizeTypeLikes(fields) as never
}

export function _object(fields: ObjectFields): RootType {
  return Object.assign(declareType(() => _object, [fields]), {
    *[Symbol.iterator]() {
      return yield* infer(this as never)
    },
  })
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
