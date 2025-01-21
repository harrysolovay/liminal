import { declareType } from "../../_declareType.ts"
import type { Type } from "../../Type.ts"

export const string: Type<string> = declareType(() => string)
