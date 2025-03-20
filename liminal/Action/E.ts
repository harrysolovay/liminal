export function* Emit<K extends keyof any, V>(key: K, value: V): Generator<Emit<K, V>, undefined> {
  return yield {
    kind: "Emit",
    key,
    value,
  }
}

export interface Emit<K extends keyof any = keyof any, V = any> {
  kind: "Emit"
  key: K
  value: V
}
