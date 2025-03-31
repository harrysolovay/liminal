import type { EmbeddingModelAdapter } from "../Adapters.ts"

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
    type: "Embedding",
    reduceEmbedding: async (scope, action) => {
      const embedding = getEmbedding()
      scope.events.emit({
        type: "embedded",
        embedding: embedding,
        value: action.value,
      })
      return scope.spread({
        next: embedding,
      })
    },
  }
}
