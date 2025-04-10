import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

export const number: Type<number, JSONNumberType> = makeType(() => number)

export interface JSONNumberType extends JSONTypeBase {
  type: "number"
}
