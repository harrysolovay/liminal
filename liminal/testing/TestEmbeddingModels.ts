import type { ExecConfig } from "../ExecConfig.js"
import type { EmbeddingModelAdapter } from "../StateReducers/StateReducers.js"

export interface TestEmbeddingModelConfig {
  getEmbedding: () => Array<number>
}

export const defaultTestingEmbeddingModelConfig: TestEmbeddingModelConfig = {
  getEmbedding: () => [],
}

export function TestEmbeddingModels<T extends ExecConfig["models"]["embedding"]>(
  config: TestEmbeddingModelConfig = defaultTestingEmbeddingModelConfig,
): T {
  const testEmbeddingModel = TestEmbeddingModel(config)
  return new Proxy(
    {},
    {
      get() {
        return testEmbeddingModel
      },
    },
  ) as T
}

export function TestEmbeddingModel({ getEmbedding }: TestEmbeddingModelConfig): EmbeddingModelAdapter {
  return async (state, action) => {
    const embedding = getEmbedding()
    state.events.emit({
      event: "Embedding",
      embedding: embedding,
      value: action.value,
    })
    return {
      ...state,
      next: embedding,
    }
  }
}
