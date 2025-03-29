import type { ActorLike } from "../common/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { Key } from "../util/Key.js"
import { ActionBase } from "./ActionBase.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { EventBase } from "./EventBase.js"

export interface Branch<S extends Spec = Spec> extends ActionBase<"Branch", S> {
  branches: Branches
}

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<
  Branch<
    | {
        LanguageModel: never
        EmbeddingModel: never
        Event: BranchesEvent<
          `${Key<B>}`,
          {
            [K in keyof B]: B[K] extends ActorLike<infer Y, infer R> ? Awaited<R> : never
          }
        >
      }
    | {
        [K in keyof B]: B[K] extends ActorLike<infer Y, infer R>
          ? ExtractSpec<Y> extends infer S extends Spec
            ? {
                LanguageModel: S["LanguageModel"]
                EmbeddingModel: S["EmbeddingModel"]
                Event: BranchEvent<`${Exclude<K, symbol>}`, S["Event"], Awaited<R>>
              }
            : never
          : never
      }[Key<B>]
  >,
  { [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }
> {
  return yield ActionBase("Branch", {
    branches,
  })
}

export type Branches = Array<ActorLike> | Record<string, ActorLike>

export type BranchesEvent<K extends string = string, R = any> = BranchesEnterEvent<K> | BranchesExitEvent<K, R>

export type BranchEvent<K extends string = string, E extends ActionEvent = any, R = any> =
  | BranchEnterEvent<K>
  | BranchInnerEvent<K, E>
  | BranchExitEvent<K, R>

export interface BranchesEnterEvent<K extends string> extends EventBase<"BranchesEnter"> {
  branches: Array<K>
}

export interface BranchEnterEvent<K extends string> extends EventBase<"BranchEnter"> {
  branch: K
}

export interface BranchInnerEvent<K extends string, E extends ActionEvent> extends EventBase<"BranchInner"> {
  branch: K
  inner: E
}

export interface BranchExitEvent<K extends string, R> extends EventBase<"BranchExit"> {
  branch: K
  result: R
}

export interface BranchesExitEvent<K extends string, R> extends EventBase<"BranchesExit"> {
  branches: Array<K>
  result: R
}
