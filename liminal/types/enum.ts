import { declareType } from "./declareType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export { enum_ as enum }
function enum_<A extends Array<string>>(...values: A): Type<A[number], JSONEnumType<A[number]>> {
  return declareType(() => enum_<A>, values)
}
Object.defineProperty(enum_, "name", { value: "enum" })

export interface JSONEnumType<K extends string = string> extends JSONTypeBase {
  type: "string"
  enum: Array<K>
}
