import { embed, type EmbeddingModel } from "ai"
import { _util, type EmbeddingModelAdapter } from "liminal"

export function EmbeddingModelAdapter(model: EmbeddingModel<any>): EmbeddingModelAdapter {
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
