import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* Emit<K extends string, V>(key: K, value: V): Generator<Emit<K, V>, undefined> {
  return yield ActionBase("Emit", { key, value })
}

export interface Emit<K extends string = string, V = any> extends ActionBase<"Emit"> {
  key: K
  value: V
}

export interface EmitEvent<K extends string = string, E = any> extends EventBase<"Emit"> {
  key: K
  value: E
}
