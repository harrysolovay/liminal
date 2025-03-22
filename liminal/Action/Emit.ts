export function* Emit<K extends keyof any, V>(value: V): Generator<Emit<V>, undefined> {
  return yield {
    kind: "Emit",
    value,
  }
}

export interface Emit<V = any> {
  kind: "Emit"
  value: V
}
