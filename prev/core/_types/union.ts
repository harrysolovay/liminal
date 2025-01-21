import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

export function union<M extends Array<Type>>(
  ...members: M
): Type<M[number]["T"]> {
  return declareType(union<M>, members)
}
