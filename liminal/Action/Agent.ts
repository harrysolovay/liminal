import type { Action } from "./Action.js"
import type { Scope } from "../Scope.js"
import type { FlowLike } from "../common/FlowLike.js"

export function* Agent<K extends keyof any, Y extends Action, T>(
  key: K,
  description: string,
  implementation: FlowLike<Y, T>,
): Generator<Agent<K, Scope<Y>>, Awaited<T>> {
  return yield {
    kind: "Agent",
    key,
    scope: undefined!,
    description,
    implementation,
  }
}

export interface Agent<K extends keyof any = keyof any, S extends Scope = Scope> {
  kind: "Agent"
  key: K
  scope: S
  description: string
  implementation: FlowLike
}
