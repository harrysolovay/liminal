import { isAsyncIterator } from "./isAsyncIterator.ts"
import { isIterator } from "./isIterator.ts"

export function isIteratorLike(
  value: unknown,
): value is IteratorObject<unknown, unknown, unknown> | AsyncIteratorObject<unknown, unknown, unknown> {
  return isIterator(value) || isAsyncIterator(value)
}
