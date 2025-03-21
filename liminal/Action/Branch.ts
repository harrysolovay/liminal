import type { ExtractYScope, Scope } from "../Scope.js"
import type { FlowLike } from "../common/FlowLike.js"

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<
  Branch<{
    [K in keyof B]: B[K] extends FlowLike<infer Y, infer T> ? ExtractYScope<K, Y, T> : never
  }>,
  {
    [K in keyof B]: B[K] extends FlowLike<any, infer T> ? Awaited<T> : never
  }
> {
  return yield {
    scopes: undefined!,
    kind: "Branch",
    branches,
  }
}

export interface Branch<S extends BranchScopes = BranchScopes> {
  kind: "Branch"
  scopes: S
  branches: Branches
}

export type Branches = Array<FlowLike> | Record<string, FlowLike>
export type BranchScopes = Array<Scope> | Record<string, Scope>
