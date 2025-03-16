export function Memo<T>(f: () => T): () => T {
  let initialized = false
  let value: T | undefined = undefined
  return () => {
    if (!initialized) {
      value = f()
      initialized = true
    }
    return value!
  }
}
