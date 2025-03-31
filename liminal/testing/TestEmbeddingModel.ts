import type { EmbeddingModelAdapter } from "../Adapters.js"

export interface TestEmbeddingModelConfig {
  getEmbedding: () => Array<number>
}

export const defaultTestingEmbeddingModelConfig: TestEmbeddingModelConfig = {
  getEmbedding: () => [],
}

export function TestEmbeddingModel(
  { getEmbedding }: TestEmbeddingModelConfig = defaultTestingEmbeddingModelConfig,
): EmbeddingModelAdapter {
  return {
    adapter: "Embedding",
    reduceEmbedding: async (scope, action) => {
      const embedding = getEmbedding()
      scope.events.emit({
        type: "Embedding",
        embedding: embedding,
        value: action.value,
      })
      return scope.spread({
        next: embedding,
      })
    },
  }
}
