import type { EmbeddingModel } from "../Model.ts"

export interface TestEmbeddingModelConfig {
  getEmbedding: () => Promise<Array<number>>
}

export const defaultTestingEmbeddingModelConfig: TestEmbeddingModelConfig = {
  getEmbedding: () => Promise.resolve([]),
}

export function TestEmbeddingModel({
  getEmbedding,
}: TestEmbeddingModelConfig = defaultTestingEmbeddingModelConfig): EmbeddingModel {
  return {
    type: "embedding",
    embed: getEmbedding,
  }
}
