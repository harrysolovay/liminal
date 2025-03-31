import type { ActionReducer } from "./Action/ActionReducer.js"
import type { Embed } from "./Embed/Embed.js"
import type { Infer } from "./Infer/Infer.js"

export type Adapter = LanguageModelAdapter | EmbeddingModelAdapter

export interface LanguageModelAdapter {
  type: "Language"
  reduceInference: ActionReducer<Infer>
}

export interface EmbeddingModelAdapter {
  type: "Embedding"
  reduceEmbedding: ActionReducer<Embed>
}
