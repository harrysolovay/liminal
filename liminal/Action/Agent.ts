import type { Action, Propagated } from "./Action.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { Model } from "./Requirement.js"

export function* Agent<K extends keyof any, Y extends Action, T>(
  key: K,
  description: string,
  implementation: DeferredOr<FlowLike<Y, T>>,
): Generator<Agent<K, Extract<Y, Model>["key"] | Extract<Y, Agent>["M"], T>, T> {
  return yield {
    M: undefined!,
    T: undefined!,
    kind: "Agent",
    key,
    description,
    implementation,
  }
}

export interface Agent<K extends keyof any = keyof any, M extends keyof any = keyof any, T = any> {
  M: M
  T: T
  kind: "Agent"
  key: K
  description: string
  implementation: DeferredOr<FlowLike>
}
