import type { Action, Propagated } from "./Action.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { FlowLike } from "../common/FlowLike.js"

export function* Agent<K extends keyof any, Y extends Action, T>(
  key: K,
  description: string,
  implementation: DeferredOr<FlowLike<Y, T>>,
): Generator<Agent<K, Extract<Y, Propagated>, T>, T> {
  return yield {
    E: undefined!,
    T: undefined!,
    kind: "Agent",
    key,
    description,
    implementation,
  }
}

export interface Agent<K extends keyof any = keyof any, E extends Propagated = Propagated, T = any> {
  E: E
  T: T
  kind: "Agent"
  key: K
  description: string
  implementation: DeferredOr<FlowLike>
}
