import { embed, type EmbeddingModel } from "ai"
import { _util, type ReduceEmbedding } from "liminal"

export const reduceEmbedding: ReduceEmbedding<EmbeddingModel<any>> = async (state, action) => {
  _util.assert(state.embeddingModel)
  const { model } = state.embeddingModel
  const { embedding } = await embed({
    model,
    value: action.value,
  })
  return {
    ...state,
    next: embedding,
  }
}
