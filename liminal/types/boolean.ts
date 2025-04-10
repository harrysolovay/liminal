import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

export const boolean: Type<boolean, JSONBooleanType> = makeType(() => boolean)

export interface JSONBooleanType extends JSONTypeBase {
  type: "boolean"
}
