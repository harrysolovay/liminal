import { ActionBase } from "../Action/ActionBase.ts"
import type { ActionLike } from "../Action/ActionLike.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { Infer } from "../Infer/Infer.ts"
import type { Scope } from "../Scope/Scope.ts"
import type { Spec } from "../Spec.ts"
import type { LanguageModelSetEvent } from "./SetLanguageModelEvent.ts"

export interface SetLanguageModel<S extends Spec = Spec> extends ActionBase<"set_language_model", S> {
  key: keyof any
  infer: InferenceActor
}

export type InferenceActor<Y extends ActionLike = ActionLike> = (
  scope: Scope,
  action: Infer,
) => Actor<Y, any>

export function* setLanguageModel<K extends keyof any, Y extends ActionLike>(
  key: K,
  infer: InferenceActor<Y>,
): Generator<
  SetLanguageModel<{
    LanguageModel: K
    EmbeddingModel: never
    Event: LanguageModelSetEvent<K>
  }>,
  void
> {
  return yield ActionBase("set_language_model", {
    key,
    infer,
  })
}
