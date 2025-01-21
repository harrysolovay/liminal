import type { Action, ExtractE } from "../../Action.ts"
import { declareThread } from "../_declareThread.ts"
import type { Thread } from "../Thread.ts"

function new_<K extends string, Y extends Action, R>(
  key: K,
  iter: Iterator<Y, R> | AsyncIterator<Y, R>,
): Thread<Awaited<R>, { [_ in K]: ExtractE<Y> }> {
  return declareThread(() => new_<K, Y, R>, [key, iter])
}
Object.defineProperty(new_, "name", { value: "new" })
export { new_ as new }
