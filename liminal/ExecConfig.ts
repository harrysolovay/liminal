import type { ActionEvent } from "./Action/ActionEvent.js"
import type { LanguageModelAdapter } from "./LanguageModelAdapter.js"
import type { EmbeddingModelAdapter } from "./EmbeddingModelAdapter.js"

export interface ExecConfig {
  handler?: (event: ActionEvent) => any
  models: {
    language: Record<string, LanguageModelAdapter>
    embedding?: Record<string, EmbeddingModelAdapter>
  }
  signal?: AbortSignal
}
