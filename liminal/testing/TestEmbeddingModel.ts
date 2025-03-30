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
    reduceEmbedding: async (state, action) => {
      const embedding = getEmbedding()
      state.events.emit({
        event: "Embedding",
        embedding: embedding,
        value: action.value,
      })
      return state.spread({
        next: embedding,
      })
    },
  }
}
