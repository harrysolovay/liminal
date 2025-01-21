import type { Action, ExtractMaybeE } from "../../Action.ts"
import { declareThread } from "../_declareThread.ts"
import type { Thread } from "../Thread.ts"

export function reduce<K extends string, Y extends Action, R>(
  key: K,
  iter: Iterator<Y, R> | AsyncIterator<Y, R>,
): Thread<Awaited<R>, ExtractMaybeE<K, Y>> {
  return declareThread(() => reduce<K, Y, R>, [key, iter])
}
