export function WeakMemo<K extends WeakKey, T>(f: (key: K) => T): (key: K) => T {
  const cache = new WeakMap<K, T>()
  return (key: K): T => {
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const value = f(key)
    cache.set(key, value)
    return value
  }
}
