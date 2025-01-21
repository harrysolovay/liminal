import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

export const boolean: Type<boolean> = declareType(() => boolean)
