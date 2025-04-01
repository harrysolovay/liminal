import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { SetEmbeddingModel } from "./SetEmbeddingModel.ts"

export const reduceSetEmbeddingModel: ActionReducer<SetEmbeddingModel> = (scope, action) => {
  scope.events.emit({
    type: "embedding_model_set",
    key: action.key,
  })
  return scope.spread({
    next: undefined,
    embed: action.embed,
  })
}
