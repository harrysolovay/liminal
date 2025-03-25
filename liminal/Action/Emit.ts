import type { JSONValue } from "../liminal_util/JSONValue.js"

export function* Emit<K extends string, V>(key: K, value: V): Generator<Emit<K, V>, undefined> {
  return yield {
    kind: "Emit",
    key,
    value,
  }
}

export interface Emit<K extends string = string, V = any> {
  kind: "Emit"
  key: K
  value: V
}
