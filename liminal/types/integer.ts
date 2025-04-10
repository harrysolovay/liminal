import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

export const integer: Type<number, JSONIntegerType> = makeType(() => integer)

export interface JSONIntegerType extends JSONTypeBase {
  type: "integer"
}
