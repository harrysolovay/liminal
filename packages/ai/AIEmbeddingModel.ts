import { embed, type EmbeddingModel } from "ai"
import { _util, type EmbeddingModelAdapter } from "liminal"

export function AIEmbeddingModel(model: EmbeddingModel<any>): EmbeddingModelAdapter {
  return {
    type: "Embedding",
    reduceEmbedding: async (scope, action) => {
      scope.events.emit({
        type: "embedding_requested",
        value: action.value,
      })
      const { embedding } = await embed({
        model,
        value: action.value,
      })
      scope.events.emit({
        type: "embedded",
        value: action.value,
        embedding,
      })
      return scope.spread({
        next: embedding,
      })
    },
  }
}
