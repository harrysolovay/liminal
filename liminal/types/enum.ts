import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

export { enum_ as enum }
function enum_<A extends Array<string>>(...values: A): Type<A[number], JSONEnumType<A[number]>> {
  return makeType(() => enum_<A>, values)
}
Object.defineProperty(enum_, "name", { value: "enum" })

export interface JSONEnumType<K extends string = string> extends JSONTypeBase {
  type: "string"
  enum: Array<K>
}
