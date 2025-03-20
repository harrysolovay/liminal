import type { Action } from "./Action.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"

export function* Agent<K extends keyof any, Y extends Action, T>(
  key: K,
  description: string,
  implementation: DeferredOr<FlowLike<Y, T>>,
): Generator<Agent<ExtractSpec<K, Y, T>>, T> {
  return yield {
    spec: undefined!,
    kind: "Agent",
    key,
    description,
    implementation,
  }
}

export interface Agent<S extends Spec = Spec> {
  spec: Spec
  kind: "Agent"
  key: S["Key"]
  description: string
  implementation: DeferredOr<FlowLike>
}
