import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

export const number: Type<number> = declareType(() => number)
