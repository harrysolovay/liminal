import { declareType } from "./declareType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export const string: Type<string, JSONStringType> = declareType(() => string)

export interface JSONStringType extends JSONTypeBase {
  type: "string"
}
