import type { ActorLike } from "../common/ActorLike.js"
import type { Spec } from "../Spec.js"
import type { Key } from "../util/Key.js"
import { ActionBase } from "./ActionBase.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { EventBase } from "./event_common.js"

export function* Branch<const B extends Branches, BKey extends `${Key<B>}`>(
  branches: B,
): Generator<
  Branch<{
    Model: never
    Event: BranchesEvent<BKey> // TODO
  }>,
  { [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }
> {
  return yield ActionBase("Branch", {
    branches,
  })
}

export interface Branch<S extends Spec = Spec> extends ActionBase<"Branch", S> {
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
