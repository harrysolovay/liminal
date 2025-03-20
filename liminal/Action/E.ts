export function* E<V>(value: V): Generator<E<V>, undefined> {
  return yield {
    kind: "E",
    value,
  }
}

export interface E<V = any> {
  kind: "E"
  value: V
}
