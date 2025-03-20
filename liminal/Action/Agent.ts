import type { Action } from "./Action.js"
import type { Expand } from "../util/Expand.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { ExtractModelKey } from "../common/ExtractModelKey.js"

export function* Agent<K extends keyof any, Y extends Action, T>(
  key: K,
  description: string,
  implementation: DeferredOr<FlowLike<Y, T>>,
): Generator<Agent<K, ExtractModelKey<Y>, T, unknown /* TODO */>, T> {
  return yield {
    M: undefined!,
    E: undefined!,
    T: undefined!,
    kind: "Agent",
    key,
    description,
    implementation,
  }
}

export interface Agent<K extends keyof any = keyof any, M extends keyof any = keyof any, E = any, T = any> {
  M: M
  E: E
  T: T
  kind: "Agent"
  key: K
  description: string
  implementation: DeferredOr<FlowLike>
}
