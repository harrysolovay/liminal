import type { Action } from "./Action.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { Spec } from "../Spec.js"

export function* Agent<K extends keyof any, Y extends Action, T>(
  key: K,
  description: string,
  implementation: DeferredOr<FlowLike<Y, T>>,
): Generator<Agent<Spec<K, Y, Awaited<T>>>, Awaited<T>> {
  return yield {
    spec: undefined!,
    kind: "Agent",
    key,
    description,
    implementation,
  }
}

export interface Agent<S extends Spec = Spec> {
  spec: S
  kind: "Agent"
  key: S["Key"]
  description: string
  implementation: DeferredOr<FlowLike>
}
