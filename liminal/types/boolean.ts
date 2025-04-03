import { declareType } from "./declareType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export const boolean: Type<boolean, JSONBooleanType> = declareType(() => boolean)

export interface JSONBooleanType extends JSONTypeBase {
  type: "boolean"
}
