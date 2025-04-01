import { ActionBase } from "../Action/ActionBase.ts"
import type { ActionLike } from "../Action/ActionLike.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { Embed } from "../Embed/Embed.ts"
import type { Scope } from "../Scope/Scope.ts"
import type { Spec } from "../Spec.ts"
import type { EmbeddingModelSetEvent } from "./SetEmbeddingModelEvent.ts"

export interface SetEmbeddingModel<S extends Spec = Spec> extends ActionBase<"set_embedding_model", S> {
  key: keyof any
  embed: EmbedActor
}

export type EmbedActor<Y extends ActionLike = ActionLike> = (
  scope: Scope,
  action: Embed,
) => Actor<Y, Array<number>>

export function* setEmbeddingModel<K extends keyof any, Y extends ActionLike>(
  key: K,
  embed: EmbedActor<Y>,
): Generator<
  SetEmbeddingModel<{
    LanguageModel: never
    EmbeddingModel: K
    Event: EmbeddingModelSetEvent<K>
  }>,
  void
> {
  return yield ActionBase("set_embedding_model", {
    key,
    embed,
  })
}
