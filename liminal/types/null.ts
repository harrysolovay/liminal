import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

const null_: Type<null, JSONNullType> = makeType(() => null_)
export { null_ as null }

export interface JSONNullType extends JSONTypeBase {
  type: "null"
}
