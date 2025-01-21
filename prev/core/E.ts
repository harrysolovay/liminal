export interface E<K extends string = string, D = any> {
  kind: "E"
  key: K
  data: D
}

export function E<K extends string, D>(key: K, data: D): E<K, D> {
  return {
    kind: "E",
    key,
    data,
  }
}
