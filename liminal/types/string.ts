import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

export const string: Type<string, JSONStringType> = makeType(() => string)

export interface JSONStringType extends JSONTypeBase {
  type: "string"
}
