import type { ExtractScope, Scope } from "../Scope.js"
import type { FlowLike } from "../common/FlowLike.js"

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<
  Branch<{
    [K in keyof B as K extends string | number ? `${K}` : never]: B[K] extends FlowLike<infer Y, infer R>
      ? ExtractScope<Y, R>
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

export type Branches = Array<FlowLike> | Record<string, FlowLike>
export type BranchScopes = Record<string, Scope>
