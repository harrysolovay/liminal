import type { DeferredOr } from "../util/DeferredOr.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { Spec } from "../Spec.js"

export function* Branch<B extends Branches>(
  branches: B,
): Generator<
  Branch<
    {
      [K in keyof B]: B[K] extends DeferredOr<FlowLike<infer Y, infer T>> ? Spec<K, Y, Awaited<T>> : never
    }[B extends Array<any> ? Extract<keyof B, number> : keyof B]
  >,
  {
    [K in keyof B]: B[K] extends DeferredOr<FlowLike<any, infer T>> ? Awaited<T> : never
  }
> {
  return yield {
    spec: undefined!,
    kind: "Branch",
    branches,
  }
}

export interface Branch<S extends Spec = Spec> {
  spec: S
  kind: "Branch"
  branches: Branches
}

export type Branches = Array<DeferredOr<FlowLike>> | Record<string, DeferredOr<FlowLike>>
