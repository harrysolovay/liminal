import type { LanguageModelV1 } from "ai"
import type { Exec, DeferredOr, IteratorLike, BranchLike } from "liminal"

export declare function AIExec<B extends BranchLike>(
  root: B,
  model: LanguageModelV1,
): B extends DeferredOr<IteratorLike<infer Y, infer T>> ? Exec<Y, T> : never
