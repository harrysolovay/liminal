export function isIterableLike(value: unknown): value is Iterable<unknown> {
  return typeof value === "object" && value !== null && (Symbol.iterator in value || Symbol.asyncIterator in value)
}
