import { embed, type EmbeddingModel } from "ai"
import { _util, type EmbeddingModelAdapter } from "liminal"

export function AIEmbeddingModel(model: EmbeddingModel<any>): EmbeddingModelAdapter {
  return async (state, action) => {
    const { embedding } = await embed({
      model,
      value: action.value,
    })
    state.events.emit({
      event: "Embedding",
      value: action.value,
      embedding,
    })
    return {
      ...state,
      next: embedding,
    }
  }
}
