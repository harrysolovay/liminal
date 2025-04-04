import { declareType } from "./declareType.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export function union<M extends Array<Type>>(...members: M): Type<M[number]["T"], JSONUnionType<M[number]["J"]>> {
  return declareType(() => union<M>, members)
}

export interface JSONUnionType<M extends JSONType = any> extends JSONTypeBase {
  anyOf: Array<M>
}
