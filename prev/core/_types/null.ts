import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

const null_: Type<null> = declareType(() => null_)
export { null_ as null }
