import { declareType } from "./declareType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

function enum_<A extends Array<string>>(...values: A): Type<A[number], JSONEnumType<A[number]>> {
  return declareType(() => enum_<A>, values.sort())
}
Object.defineProperty(enum_, "name", { value: "enum" })
export { enum_ as enum }

export interface JSONEnumType<K extends string = string> extends JSONTypeBase {
  type: "string"
  enum: Array<K>
}
