import { declareType } from "../../_declareType.ts"
import type { Type } from "../../Type.ts"

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }> {
  return declareType(() => object<F>, [fields])
}
