import type { ActionReducer } from "./Action/ActionReducer.js"
import type { Embedding } from "./Embedding/Embedding.js"
import type { Generation } from "./Generation/Generation.js"

export type Adapter = LanguageModelAdapter | EmbeddingModelAdapter

export interface LanguageModelAdapter {
  adapter: "Language"
  reduceGeneration: ActionReducer<Generation>
}

export interface EmbeddingModelAdapter {
  adapter: "Embedding"
  reduceEmbedding: ActionReducer<Embedding>
}
