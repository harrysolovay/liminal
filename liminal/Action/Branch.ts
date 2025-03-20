import type { DeferredOr } from "../util/DeferredOr.js"
import type { FlowLike } from "../common/FlowLike.js"

export function* Branch<B extends Branches>(
  branches: B,
): Generator<
  Branch<B>,
  {
    [K in keyof B]: B[K] extends DeferredOr<FlowLike<any, infer T>> ? T : never
  }
> {
  return yield {
    kind: "Branch",
    branches,
  }
}

export interface Branch<B extends Branches = Branches> {
  kind: "Branch"
  branches: B
}

export type Branches = Array<DeferredOr<FlowLike>> | Record<string, DeferredOr<FlowLike>>
