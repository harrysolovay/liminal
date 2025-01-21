import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

function const_<T, const V extends T>(valueType: Type<T>, value: V): Type<V> {
  return declareType(() => const_<T, V>, [valueType, value])
}
Object.defineProperty(const_, "name", { value: "const" })
export { const_ as const }
