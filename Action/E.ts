export interface E<K extends string = string, V = any> {
  kind: "E"
  key: K
  value: V
}

export function E<K extends string, V>(key: K, value: V): E<K, V> {
  return {
    kind: "E",
    key,
    value,
  }
}
