import type { ActionReducer } from "./Action/ActionReducer.js"
import type { Embedding } from "./Embedding/Embedding.js"
import type { Inference } from "./Generation/Generation.js"

export type Adapter = LanguageModelAdapter | EmbeddingModelAdapter

export interface LanguageModelAdapter {
  adapter: "Language"
  reduceInference: ActionReducer<Inference>
}

export interface EmbeddingModelAdapter {
  adapter: "Embedding"
  reduceEmbedding: ActionReducer<Embedding>
}
