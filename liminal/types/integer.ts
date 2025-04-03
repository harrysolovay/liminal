import { declareType } from "./declareType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export const integer: Type<number, JSONIntegerType> = declareType(() => integer)

export interface JSONIntegerType extends JSONTypeBase {
  type: "integer"
}
