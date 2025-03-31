import type { ActionReducer } from "./Action/ActionReducer.ts"
import type { Embed } from "./Embed/Embed.ts"
import type { Infer } from "./Infer/Infer.ts"

export type Adapter = LanguageModelAdapter | EmbeddingModelAdapter

export interface LanguageModelAdapter {
  type: "Language"
  reduceInference: ActionReducer<Infer>
}

export interface EmbeddingModelAdapter {
  type: "Embedding"
  reduceEmbedding: ActionReducer<Embed>
}
