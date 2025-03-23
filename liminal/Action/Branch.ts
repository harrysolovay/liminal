import type { BranchEvent } from "../Event.js"
import type { ExtractYScope, Scope } from "../Scope.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { Key } from "../liminal_util/Key.js"

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<
  Branch<{
    [K in keyof B as K extends string | number ? `${K}` : never]: B[K] extends FlowLike<infer Y, infer R>
      ? ExtractYScope<Y, R>
      : never
  }>,
  { [K in keyof B]: B[K] extends FlowLike<any, infer R> ? Awaited<R> : never }
> {
  return yield {
    "": undefined!,
    kind: "Branch",
    branches,
  }
}

export interface Branch<S extends BranchScopes = BranchScopes> {
  "": S
  kind: "Branch"
  branches: Branches
}

export type BranchesList = Array<FlowLike>
export type BranchesRecord = Record<string, FlowLike>
export type Branches = BranchesList | BranchesRecord

export type BranchScopes = Record<string, Scope>

export type ExtractBranchEvent<B extends Branch> = {
  [K in Key<B[""]>]: BranchEvent<K, Extract<B[""][K], Scope>["Event"]>
}[Key<B[""]>]
