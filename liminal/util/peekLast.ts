export function peekLast<T>(set: Set<T>): T | undefined {
  return [...set][set.size - 1]
}
