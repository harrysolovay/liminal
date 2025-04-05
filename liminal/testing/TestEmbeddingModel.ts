import type { RunEmbed } from "../actions/SetEmbeddingModel"

export interface TestEmbeddingModelConfig {
  getEmbedding: () => Array<number>
}

export const defaultTestingEmbeddingModelConfig: TestEmbeddingModelConfig = {
  getEmbedding: () => [],
}

export function TestEmbeddingModel({
  getEmbedding,
}: TestEmbeddingModelConfig = defaultTestingEmbeddingModelConfig): RunEmbed {
  return async () => getEmbedding()
}
