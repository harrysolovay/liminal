import type { ActorLike } from "../common/ActorLike.js"
import { ActionBase } from "./ActionBase.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { EventBase } from "./event_common.js"

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<Branch, { [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }> {
  return yield ActionBase("Branch", {
    branches,
  })
}

export interface Branch extends ActionBase<"Branch"> {
  branches: Branches
}

export type Branches = Array<ActorLike> | Record<string, ActorLike>

export interface BranchesEvent<K extends string = string> extends EventBase<"Branches"> {
  keys: Array<K>
}

export interface BranchEvent<K extends string = string, E extends ActionEvent = ActionEvent>
  extends EventBase<"Branch"> {
  key: K
  inner: E
}
