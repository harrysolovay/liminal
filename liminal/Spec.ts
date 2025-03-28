import type { IsExact } from "conditional-type-checks"
import type { Action, ActionLike } from "./Action/Action.js"
import type { ActionEvent } from "./Action/ActionEvent.js"
import type { ActorLike } from "./common/ActorLike.js"

export interface Spec {
  LanguageModel: string
  EmbeddingModel: string
  Event: ActionEvent
}

export type ExtractSpec<Y extends ActionLike> = MergeSpec<Extract<Y, Action>[""]>

type MergeSpec<S extends Spec> = {
  LanguageModel: S["LanguageModel"]
  EmbeddingModel: S["EmbeddingModel"]
  Event: S["Event"]
}

export declare function assertSpec<Y extends ActionLike, R, E extends Extract<Y, Action>[""]>(
  _actorLike: ActorLike<Y, R>,
): <A extends Spec>(...[passes]: IsExact<E, A> extends true ? [passes?: true] : [passes: false]) => void

export declare function AssertionScope(
  f: (assert: {
    spec<Y extends ActionLike, R, E extends ExtractSpec<Y>>(
      actorLike: ActorLike<Y, R>,
    ): {
      equals<A extends Spec>(...[passes]: IsExact<E, A> extends true ? [passes?: true] : [passes: false]): void
    }
  }) => void,
): void
