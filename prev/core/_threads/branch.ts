import type { Action } from "../Action.ts"
import type { Thread } from "../Thread.ts"
import { declareThread } from "./_declareThread.ts"

export function branch<K extends string, Y extends Action, T>(
  key: K,
  iterator: Iterator<Y, T>,
): Thread<T, { [_ in K]: Action.ExtractEvent<Y> }> {
  return declareThread(() => branch<K, Y, T>, [key, iterator])
}
