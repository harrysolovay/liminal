import { embed, type EmbeddingModel } from "ai"
import { _util, type EmbeddingModelAdapter } from "liminal"

export function AIEmbeddingModel(model: EmbeddingModel<any>): EmbeddingModelAdapter {
  return {
    adapter: "Embedding",
    reduceEmbedding: async (scope, action) => {
      const { embedding } = await embed({
        model,
        value: action.value,
      })
      scope.events.emit({
        event: "Embedding",
        value: action.value,
        embedding,
      })
      return scope.spread({
        next: embedding,
      })
    },
  }
}
