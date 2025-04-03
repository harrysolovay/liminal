import type { JSONValue } from "../util/JSONValue.ts"
import { declareType } from "./declareType.ts"
import type { ConstableType } from "./JSONType.ts"
import type { Type } from "./Type.ts"

export function ref<T extends JSONValue, J extends ConstableType>(getType: () => Type<T, J>): Type<T, JSONRefType> {
  return declareType(() => ref<T, J>, [getType])
}

export interface JSONRefType {
  $ref: string
}
