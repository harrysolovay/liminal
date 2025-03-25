import type { ExecSpec } from "./ExecSpec.js"

export interface ExecConfig<S extends ExecSpec = ExecSpec> {
  handler?: (event: Event) => unknown
  models: {
    language: Record<string, S["LanguageModel"]>
    embedding: Record<string, S["EmbeddingModel"]>
  }
  signal?: AbortSignal // TODO
  encodeTypes?: boolean // TODO: encode values as JSONC and include type comments
}
