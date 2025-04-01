import { embed, type EmbeddingModel } from "ai"
import { _util, type RunEmbed } from "liminal"

export function AIEmbeddingModel(model: EmbeddingModel<any>): RunEmbed {
  return async (action) => {
    const { embedding } = await embed({
      model,
      value: action.value,
    })
    return embedding
  }
}
