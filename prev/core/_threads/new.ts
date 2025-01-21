import type { Action } from "../Action.ts"
import type { Thread } from "../Thread.ts"
import { declareThread } from "./_declareThread.ts"

function new_<K extends string, Y extends Action, T>(
  key: K,
  iterator: Iterator<Y, T>,
): Thread<T, { [_ in K]: Action.ExtractEvent<Y> }> {
  return declareThread(() => new_<K, Y, T>, [key, iterator])
}
Object.defineProperty(new_, "name", { value: "new" })
export { new_ as new }
