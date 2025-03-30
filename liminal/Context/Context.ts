import { ActionBase } from "../Action/ActionBase.js"
import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { ContextEvent } from "./ContextEvent.js"

export interface Context<S extends Spec = Spec> extends ActionBase<"Context", S> {
  key: keyof any
  implementation?: ActorLike
}

export function* Context<K extends keyof any, Y extends ActionLike, S extends ExtractSpec<Y>, R = string>(
  key: K,
  implementation: ActorLike<Y, R>,
): Generator<
  Context<{
    LanguageModel: S["LanguageModel"]
    EmbeddingModel: S["EmbeddingModel"]
    Event: ContextEvent<K, S["Event"], R>
  }>,
  Awaited<R>
> {
  return yield ActionBase("Context", {
    key,
    implementation,
  })
}
