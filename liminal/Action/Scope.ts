import type { Action } from "./Action.js"
import type { ActorLike } from "../common/ActorLike.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { ActionEvent } from "./ActionEvent.js"

export function* Scope<K extends string, Y extends Action, R = string>(
  key: K,
  implementation: ActorLike<Y, R>,
): Generator<Scope, Awaited<R>> {
  return yield ActionBase("Scope", {
    key,
    implementation,
  })
}

export interface Scope<K extends string = string> extends ActionBase<"Scope"> {
  key: K
  implementation: ActorLike
}

export interface ScopeEvent<K extends string = string, E extends ActionEvent = ActionEvent> extends EventBase<"Scope"> {
  key: K
  inner: E
}
