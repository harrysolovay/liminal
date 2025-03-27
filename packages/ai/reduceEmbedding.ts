import { embed, type EmbeddingModel } from "ai"
import { _util, type ReduceEmbedding } from "liminal"

export const reduceEmbedding: ReduceEmbedding<EmbeddingModel<any>> = async (state, action, model) => {
  const { embedding } = await embed({
    model,
    value: action.value,
  })
  return {
    ...state,
    next: embedding,
  }
}
