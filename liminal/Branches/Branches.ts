import { ActionBase } from "../Action/ActionBase.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type {
  BranchEnterEvent,
  BranchesEnterEvent,
  BranchesExitEvent,
  BranchExitEvent,
  BranchInnerEvent,
} from "./BranchesEvent.js"

export interface Branches<S extends Spec = Spec> extends ActionBase<"Branches", S> {
  key: keyof any
  branches: BranchImplementations
}

export type BranchImplementations = Array<ActorLike> | Record<keyof any, ActorLike>

export function Branches<K extends keyof any, const B extends Array<ActorLike>>(
  key: K,
  branches: B,
): Generator<
  Branches<
    | {
      LanguageModel: never
      EmbeddingModel: never
      Event: BranchesEnterEvent<K> | BranchesExitEvent<K, BranchesResult<B>>
    }
    | {
      [L in keyof B]: B[L] extends ActorLike<infer Y, infer R> ? ExtractSpec<Y> extends infer S extends Spec ? {
            LanguageModel: S["LanguageModel"]
            EmbeddingModel: S["EmbeddingModel"]
            Event: BranchEnterEvent<K, L> | BranchInnerEvent<K, L, S["Event"]> | BranchExitEvent<K, L, Awaited<R>>
          }
        : never
        : never
    }[number]
  >,
  BranchesResult<B>
>
export function Branches<K extends keyof any, B extends Record<keyof any, ActorLike>>(
  key: K,
  branches: B,
): Generator<
  Branches<
    | {
      LanguageModel: never
      EmbeddingModel: never
      Event: BranchesEnterEvent<K> | BranchesExitEvent<K, BranchesResult<B>>
    }
    | {
      [L in keyof B]: B[L] extends ActorLike<infer Y, infer R> ? ExtractSpec<Y> extends infer S extends Spec ? {
            LanguageModel: S["LanguageModel"]
            EmbeddingModel: S["EmbeddingModel"]
            Event: BranchEnterEvent<K, L> | BranchInnerEvent<K, L, S["Event"]> | BranchExitEvent<K, L, Awaited<R>>
          }
        : never
        : never
    }[keyof B]
  >,
  BranchesResult<B>
>
export function* Branches<B extends BranchImplementations>(
  key: keyof any,
  branches: B,
): Generator<Branches, BranchesResult<B>> {
  return yield ActionBase("Branches", {
    key,
    branches,
  })
}

export type BranchesResult<B> = [{ [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }][0]
