import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

export function array<T>(element: Type<T>): Type<Array<T>> {
  return declareType(() => array<T>, [element])
}
