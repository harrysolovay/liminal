export class WeakMemo<K extends WeakKey, T> {
  #cache = new WeakMap<K, T>()
  constructor(private f: (key: K) => T) {}

  getOrInit = (key: K): T => {
    if (this.#cache.has(key)) {
      return this.#cache.get(key)!
    }
    const value = this.f(key)
    this.#cache.set(key, value)
    return value
  }
}
