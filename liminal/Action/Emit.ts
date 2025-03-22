import type { JSONValue } from "../util/JSONValue.js"

export function* Emit<K extends keyof any, V extends JSONValue>(value: V): Generator<Emit<V>, undefined> {
  return yield {
    kind: "Emit",
    value,
  }
}

export interface Emit<V extends JSONValue = any> {
  kind: "Emit"
  value: V
}
