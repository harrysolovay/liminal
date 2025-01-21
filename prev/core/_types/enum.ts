import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declareType(enum_<V>, values.toSorted())
}
Object.defineProperty(enum_, "name", { value: "enum" })
export { enum_ as enum }
