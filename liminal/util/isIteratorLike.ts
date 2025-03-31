import { isAsyncIterator } from "./isAsyncIterator.js"
import { isIterator } from "./isIterator.js"

export function isIteratorLike(
  value: unknown,
): value is IteratorObject<unknown, unknown, unknown> | AsyncIteratorObject<unknown, unknown, unknown> {
  return isIterator(value) || isAsyncIterator(value)
}
