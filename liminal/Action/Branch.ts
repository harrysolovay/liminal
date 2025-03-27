import type { ActorLike } from "../common/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { Key } from "../util/Key.js"
import { ActionBase } from "./ActionBase.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { EnterEvent, EventBase, ExitEvent } from "./event_common.js"

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<
  Branch<
    | {
        LanguageModel: never
        EmbeddingModel: never
        Event: BranchesEvent<`${Key<B>}`>
      }
    | {
        [K in keyof B]: B[K] extends ActorLike<infer Y, infer R>
          ? ExtractSpec<Y> extends infer S extends Spec
            ? {
                LanguageModel: S["LanguageModel"]
                EmbeddingModel: S["EmbeddingModel"]
                Event: BranchEvent<`${Exclude<K, symbol>}`, EnterEvent | S["Event"] | ExitEvent<R>>
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

export interface Branch<S extends Spec = Spec> extends ActionBase<"Branch", S> {
  branches: Branches
}

export type Branches = Array<ActorLike> | Record<string, ActorLike>

export interface BranchesEvent<K extends string = string> extends EventBase<"Branches"> {
  keys: Array<K>
}

export interface BranchEvent<K extends string = string, E extends ActionEvent = ActionEvent>
  extends EventBase<"Branch"> {
  key: K
  inner: E
}
