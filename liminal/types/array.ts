import type { JSONValue } from "../util/JSONValue.ts"
import { declareType } from "./declareType.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import type { Type } from "./Type.ts"

export function array<T extends JSONValue, J extends JSONType>(
  element: Type<T, J>,
): Type<Array<T>, JSONArrayType<J>> {
  return declareType(() => array<T, J>, [element])
}

export interface JSONArrayType<E extends JSONType = any> extends JSONTypeBase {
  type: "array"
  items: E
}
