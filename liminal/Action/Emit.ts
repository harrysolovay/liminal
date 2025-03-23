import type { EmitEvent } from "../Event.js"
import type { JSONValue } from "../liminal_util/JSONValue.js"

export function* Emit<K extends string, V extends JSONValue>(key: K, value: V): Generator<Emit<K, V>, undefined> {
  return yield {
    kind: "Emit",
    key,
    value,
  }
}

export interface Emit<K extends string = string, V extends JSONValue = JSONValue> {
  kind: "Emit"
  key: K
  value: V
}

export type ExtractEmitEvent<E extends Emit> = {
  [K in E["key"]]: EmitEvent<K, Extract<E, Emit<K>>["value"]>
}[E["key"]]
