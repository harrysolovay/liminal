import { embed, type EmbeddingModel } from "ai"
import { _util, type L, type RunEmbed } from "liminal"

export function AIEmbeddingModel(model: EmbeddingModel<any>): RunEmbed {
  return async (value) => {
    const { embedding } = await embed({ model, value })
    return embedding
  }
}
