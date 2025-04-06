import type { RunEmbed } from "../adapters.ts"

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
