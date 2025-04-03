import { embed, type EmbeddingModel } from "ai"
import { _util, type L } from "liminal"

export function AIEmbeddingModel(model: EmbeddingModel<any>): L.RunEmbed {
  return async (action) => {
    const { embedding } = await embed({ model, value: action.value })
    return embedding
  }
}
