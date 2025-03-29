import { ActionBase } from "../Action/ActionBase.js"
import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { Key } from "../util/Key.js"
import type {
  BranchEnterEvent,
  BranchesEnterEvent,
  BranchesExitEvent,
  BranchExitEvent,
  BranchInnerEvent,
} from "./BranchesEvent.js"

export interface Branches<S extends Spec = Spec> extends ActionBase<"Branches", S> {
  branches: BranchImplementations
}

export function* Branches<const B extends BranchImplementations>(
  branches: B,
): Generator<
  Branches<
    | {
      LanguageModel: never
      EmbeddingModel: never
      Event: `${Key<B>}` extends infer K extends string ?
          | BranchesEnterEvent<K>
          | BranchesExitEvent<
            K,
            {
              [K in keyof B]: B[K] extends ActorLike<ActionLike, infer R> ? Awaited<R> : never
            }
          >
        : never
    }
    | {
      [K in keyof B]: B[K] extends ActorLike<infer Y, infer R>
        ? ExtractSpec<Y> extends infer S extends Spec ? `${Exclude<K, symbol>}` extends infer K2 extends string ? {
              LanguageModel: S["LanguageModel"]
              EmbeddingModel: S["EmbeddingModel"]
              Event: BranchEnterEvent<K2> | BranchInnerEvent<K2, S["Event"]> | BranchExitEvent<K2, Awaited<R>>
            }
          : never
        : never
        : never
    }[Key<B>]
  >,
  { [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }
> {
  return yield ActionBase("Branches", {
    branches,
  })
}

export type BranchImplementations = Array<ActorLike> | Record<string, ActorLike>
