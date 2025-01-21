import type { Action, ExtractE } from "../../Action.ts"
import { declareThread } from "../_declareThread.ts"
import type { Thread } from "../Thread.ts"

export function branch<K extends string, Y extends Action, R>(
  key: K,
  iter: Iterator<Y, R> | AsyncIterator<Y, R>,
): Thread<Awaited<R>, { [_ in K]: ExtractE<Y> }> {
  return declareThread(() => branch<K, Y, R>, [key, iter])
}
