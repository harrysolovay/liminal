import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { Key } from "../util/Key.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { ActionEvent } from "../Action/ActionEvent.js"
import type { EventBase } from "../Action/ActionEventBase.js"
import type { ActionLike } from "../Action/ActionLike.js"

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
        Event: `${Key<B>}` extends infer K extends string
          ?
              | BranchEnterEvent<K>
              | BranchExitEvent<
                  K,
                  {
                    [K in keyof B]: B[K] extends ActorLike<ActionLike, infer R> ? Awaited<R> : never
                  }
                >
          : never
      }
    | {
        [K in keyof B]: B[K] extends ActorLike<infer Y, infer R>
          ? ExtractSpec<Y> extends infer S extends Spec
            ? {
                LanguageModel: S["LanguageModel"]
                EmbeddingModel: S["EmbeddingModel"]
                Event: BranchArmEvent<`${Exclude<K, symbol>}`, S["Event"], Awaited<R>>
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

export type BranchesEvent<K extends string = string, R = any> = BranchEnterEvent<K> | BranchExitEvent<K, R>

export type BranchArmEvent<K extends string = string, E extends ActionEvent = any, R = any> =
  | BranchArmEnterEvent<K>
  | BranchArmInnerEvent<K, E>
  | BranchArmExitEvent<K, R>

export interface BranchEnterEvent<K extends string> extends EventBase<"BranchEnter"> {
  branches: Array<K>
}

export interface BranchArmEnterEvent<K extends string> extends EventBase<"BranchArmEnter"> {
  branch: K
}

export interface BranchArmInnerEvent<K extends string, E extends ActionEvent> extends EventBase<"BranchArmInner"> {
  branch: K
  inner: E
}

export interface BranchArmExitEvent<K extends string, R> extends EventBase<"BranchArmExit"> {
  branch: K
  result: R
}

export interface BranchExitEvent<K extends string, R> extends EventBase<"BranchExit"> {
  branches: Array<K>
  result: R
}
