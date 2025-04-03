import { declareType } from "./declareType.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export function union<M extends Array<Type>>(...members: M): Type<M[number]["T"], JSONUnionType<JSONUnionMembers<M>>> {
  return declareType(() => union<M>, members)
}

export type JSONUnionMembers<M extends Array<Type>> = {
  [K in keyof M]: M[K]["J"]
}

export interface JSONUnionType<F extends Array<JSONType> = any> extends JSONTypeBase {
  anyOf: F
}
