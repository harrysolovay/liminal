export function isIterator(value: unknown): value is IteratorObject<unknown, unknown, unknown> {
  return typeof value === "object"
    && value != null
    && Symbol.iterator in value
    && typeof value[Symbol.iterator] === "function"
}
