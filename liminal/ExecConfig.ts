import type { LanguageModelAdapter } from "./LanguageModelAdapter.js"
import type { EmbeddingModelAdapter } from "./EmbeddingModelAdapter.js"
import type { Spec } from "./Spec.js"

export interface ExecConfig<S extends Spec = Spec> {
  handler?: (event: S["Event"]) => any
  models: {
    language: {
      default: LanguageModelAdapter
    } & {
      [K in S["LanguageModel"]]: LanguageModelAdapter
    }
    embedding?: Record<string, EmbeddingModelAdapter>
  } & ([S["EmbeddingModel"]] extends [true] ? { [K in S["EmbeddingModel"]]: EmbeddingModelAdapter } : {})
  signal?: AbortSignal
}
