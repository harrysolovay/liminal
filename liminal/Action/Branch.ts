import type { BranchLike } from "../util/BranchLike.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { IteratorLike } from "../util/IteratorLike.js"

export declare function branch<A extends Array<BranchLike>>(
  ...branches: A
): Iterable<any, { [K in keyof A]: A[K] extends DeferredOr<IteratorLike<any, infer T>> ? T : never }>
export declare function branch<A extends Record<string, BranchLike>>(
  branches: A,
): Iterable<any, { [K in keyof A]: A[K] extends DeferredOr<IteratorLike<any, infer T>> ? T : never }>

export interface Branch {
  kind: "Branch"
}
