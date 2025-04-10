import type { JSONValue } from "../util/JSONValue.ts"
import type { ConstableType } from "./JSONType.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"

function const_<T extends JSONValue, J extends ConstableType, const V extends T>(
  type: Type<T, J>,
  value: V,
): Type<V, JSONConstType<J, V>> {
  return makeType(() => const_<T, J, V>, [type, value])
}
Object.defineProperty(const_, "name", { value: "const" })
export { const_ as const }

export type JSONConstType<J extends ConstableType = any, V extends JSONValue = JSONValue> = J & {
  const: V
}
