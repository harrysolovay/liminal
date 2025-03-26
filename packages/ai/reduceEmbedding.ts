import { embed, type EmbeddingModel } from "ai"
import { _util, type EmbeddingModelAdapterReducers } from "liminal"

export const reduceEmbedding: EmbeddingModelAdapterReducers<EmbeddingModel<any>>["reduceEmbedding"] = async (
  state,
  action,
  model,
) => {
  _util.assert(model)
  const { embedding } = await embed({
    model,
    value: action.value,
  })
  return {
    ...state,
    next: embedding,
  }
}
