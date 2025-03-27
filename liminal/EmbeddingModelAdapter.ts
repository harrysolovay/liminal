import type { Embedding } from "./Action/Embedding.js"
import type { ActionReducer } from "./StateReducers/ActionReducer.js"

export function EmbeddingModelAdapter<EmbeddingModel>(
  reduceEmbedding: ReduceEmbedding<EmbeddingModel>,
): (embeddingModel: EmbeddingModel) => EmbeddingModelAdapter<EmbeddingModel> {
  return (model) => ({
    adapter: "Embedding",
    model,
    reduceEmbedding,
  })
}

export type ReduceEmbedding<EmbeddingModel> = ActionReducer<[embedding: Embedding, embeddingModel: EmbeddingModel]>

export interface EmbeddingModelAdapter<EmbeddingModel = any> {
  adapter: "Embedding"
  model: EmbeddingModel
  reduceEmbedding: ReduceEmbedding<EmbeddingModel>
}
