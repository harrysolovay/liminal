export function* branch<K extends number | string, Y, T>(
  key: K,
  f: Iterator<Y, T, void> | AsyncIterator<Y, T, void> | (() => Iterator<Y, T, void> | AsyncIterator<Y, T, void>),
): Generator<Branch<K, Y, T>, T> {
  return yield {
    kind: "Branch",
    key,
    f,
  }
}

export interface Branch<K extends number | string, Y, T> {
  kind: "Branch"
  key: K
  f: Iterator<Y, T, void> | AsyncIterator<Y, T, void> | (() => Iterator<Y, T, void> | AsyncIterator<Y, T, void>)
}
