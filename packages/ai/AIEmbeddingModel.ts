import { embed, type EmbeddingModel } from "ai"
import { _util, type EmbedActor } from "liminal"

// scope.events.emit({
//   type: "embedding_requested",
//   value: action.value,
// })

export function AIEmbeddingModel(model: EmbeddingModel<any>): EmbedActor<never> {
  return async function*(_scope, action) {
    const { embedding } = await embed({
      model,
      value: action.value,
    })
    return embedding
  }
}

// scope.events.emit({
//   type: "embedded",
//   value: action.value,
//   embedding,
// })
