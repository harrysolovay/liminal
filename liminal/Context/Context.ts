import { ActionBase } from "../Action/ActionBase.js"
import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { ContextEnteredEvent, ContextExitedEvent, ContextInnerEvent } from "./ContextEvent.js"

export interface Context<S extends Spec = Spec> extends ActionBase<"context", S> {
  key: keyof any
  implementation: ActorLike
}

export function* Context<K extends keyof any, Y extends ActionLike, S extends ExtractSpec<Y>, T = string>(
  key: K,
  implementation: ActorLike<Y, T>,
): Generator<
  Context<{
    LanguageModel: S["LanguageModel"]
    EmbeddingModel: S["EmbeddingModel"]
    Event: ContextEnteredEvent<K> | ContextInnerEvent<K, S["Event"]> | ContextExitedEvent<K, T>
  }>,
  T
> {
  return yield ActionBase("context", {
    key,
    implementation,
  })
}
