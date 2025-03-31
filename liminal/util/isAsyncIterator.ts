export function isAsyncIterator(value: unknown): value is AsyncIteratorObject<unknown, unknown, unknown> {
  return typeof value === "object"
    && value != null
    && Symbol.asyncIterator in value
    && typeof value[Symbol.asyncIterator] === "function"
}
