import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

export function deferred<T>(get: () => Type<T>): Type<T> {
  return declareType(() => deferred<T>, [get])
}
