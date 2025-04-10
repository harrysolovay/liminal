import type { JSONValue } from "../util/JSONValue.ts"
import type { ConstableType } from "./JSONType.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

export function ref<T extends JSONValue, J extends ConstableType>(getType: () => Type<T, J>): Type<T, JSONRefType> {
  return makeType(() => ref<T, J>, [getType])
}

export interface JSONRefType {
  $ref: string
}
