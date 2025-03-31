import { _util, type EmbeddingModelAdapter } from "liminal"
import { Ollama } from "ollama"

export function OllamaEmbeddingModel(ollama: Ollama, model: string): EmbeddingModelAdapter {
  return {
    adapter: "Embedding",
    reduceEmbedding: async (scope, action) => {
      const { embeddings } = await ollama.embed({
        model,
        input: action.value,
      })
      const embedding = embeddings[0]! // TODO
      scope.events.emit({
        type: "Embedding",
        value: action.value,
        embedding,
      })
      return scope.spread({
        next: embedding,
      })
    },
  }
}
