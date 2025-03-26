import type { ActionEvent } from "./Action/ActionEvent.js"
import type { EmbeddingModelAdapter, LanguageModelAdapter } from "./ModelAdapter.js"

export interface ExecConfig {
  handler?: (event: ActionEvent) => any
  models: {
    language: Record<string, LanguageModelAdapter>
    embedding: Record<string, EmbeddingModelAdapter>
  }
  signal?: AbortSignal // TODO
  encodeTypes?: boolean // TODO: encode values as JSONC and include type comments
}
