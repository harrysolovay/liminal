export interface Emit<K extends number | string = number | string, V = any> {
  kind: "E"
  key: K
  value: V
}

export function emit<K extends number | string, V>(key: K, value: V): Emit<K, V> {
  return {
    kind: "E",
    key,
    value,
  }
}
