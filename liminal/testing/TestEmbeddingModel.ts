import type { EmbedActor } from "../SetEmbeddingModel/SetEmbeddingModel"

export interface TestEmbeddingModelConfig {
  getEmbedding: () => Array<number>
}

export const defaultTestingEmbeddingModelConfig: TestEmbeddingModelConfig = {
  getEmbedding: () => [],
}

export function TestEmbeddingModel({
  getEmbedding,
}: TestEmbeddingModelConfig = defaultTestingEmbeddingModelConfig): EmbedActor {
  return function*() {
    return getEmbedding()
  }
}
