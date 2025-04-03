import { declareType } from "./declareType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export const number: Type<number, JSONNumberType> = declareType(() => number)

export interface JSONNumberType extends JSONTypeBase {
  type: "number"
}
