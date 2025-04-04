import { infer } from "../actions/Infer.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { TupleToRecord } from "../util/TupleToRecord.ts"
import { declareType } from "./declareType.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { RootType } from "./RootType.ts"
import { type Type } from "./Type.ts"

// It's okay that it's not generically-typed. Internal only.
export function _object(fields: _ObjectFields): RootType {
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

export type _ObjectFields = _TupleFields | _RecordFields
export type _TupleFields = Array<Type>
export type _RecordFields = Record<JSONKey, Type>
