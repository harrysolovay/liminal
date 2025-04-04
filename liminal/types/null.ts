import { declareType } from "./declareType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

const null_: Type<null, JSONNullType> = declareType(() => null_)
export { null_ as null }

export interface JSONNullType extends JSONTypeBase {
  type: "null"
}
