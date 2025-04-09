import { embed, type EmbeddingModel as AIEmbeddingModel } from "ai"
import { _util, type EmbeddingModel, type L } from "liminal"

export function AIEmbeddingModel(model: AIEmbeddingModel<any>): EmbeddingModel {
  return {
    type: "embedding",
    async embed(value) {
      const { embedding } = await embed({ model, value })
      return embedding
    },
  }
}
