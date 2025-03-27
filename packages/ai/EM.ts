import { embed, type EmbeddingModel } from "ai"
import { _util, type ReduceEmbedding } from "liminal"

export function EM(model: EmbeddingModel<any>): ReduceEmbedding {
  return async (state, action) => {
    const { embedding } = await embed({
      model,
      value: action.value,
    })
    return {
      ...state,
      next: embedding,
    }
  }
}
