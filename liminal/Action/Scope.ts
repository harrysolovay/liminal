import type { Action } from "./Action.js"
import type { ActorLike } from "../common/ActorLike.js"

export function* Scope<K extends string, Y extends Action, R = string>(
  key: K,
  implementation: ActorLike<Y, R>,
): Generator<Scope, Awaited<R>> {
  return yield {
    kind: "Scope",
    key,
    implementation,
  }
}

export interface Scope<K extends string = string> {
  kind: "Scope"
  key: K
  implementation: ActorLike
}

export interface ScopeEvent<K extends string = string, E extends Event = Event> {
  type: "Scope"
  key: K
  event: E
}

export interface EnterEvent {
  type: "Enter"
}

export interface ExitEvent<T = any> {
  type: "Exit"
  result: T
}
