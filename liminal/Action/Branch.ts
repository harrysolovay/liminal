import type { ExtractScope, Scope } from "../Scope.js"
import type { AgentLike } from "../common/AgentLike.js"
import { Phantom } from "../liminal_util/Phantom.js"

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<
  Branch<{
    [K in keyof B as K extends string | number ? `${K}` : never]: B[K] extends AgentLike<infer Y, infer R>
      ? ExtractScope<Y, R>
      : never
  }>,
  { [K in keyof B]: B[K] extends AgentLike<any, infer R> ? Awaited<R> : never }
> {
  return yield Phantom({
    kind: "Branch",
    branches,
  })
}

export interface Branch<S extends BranchScopes = BranchScopes> extends Phantom<S> {
  kind: "Branch"
  branches: Branches
}

export type Branches = Array<AgentLike> | Record<string, AgentLike>
export type BranchScopes = Record<string, Scope>
