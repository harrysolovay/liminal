import type { Embedding } from "./Action/Embedding.js"
import type { Generation } from "./Action/Generation.js"
import type { ExecState } from "./ExecState.js"
import type { PromiseOr } from "./util/PromiseOr.js"

export interface LanguageModelAdapterReducers<LanguageModel> {
  reduceGeneration: AdapterActionReducer<[generation: Generation, languageModel: LanguageModel]>
}

export interface LanguageModelAdapter<LanguageModel = any> {
  adapter: "Language"
  model: LanguageModel
  reducers: LanguageModelAdapterReducers<LanguageModel>
}

export function LanguageModelAdapter<LanguageModel>(
  reducers: LanguageModelAdapterReducers<LanguageModel>,
): (embeddingModel: LanguageModel) => LanguageModelAdapter {
  return (model) => ({
    adapter: "Language",
    model,
    reducers,
  })
}

export interface EmbeddingModelAdapterReducers<EmbeddingModel> {
  reduceEmbedding: AdapterActionReducer<[embedding: Embedding, embeddingModel: EmbeddingModel]>
}

export interface EmbeddingModelAdapter<EmbeddingModel = any> {
  adapter: "Embedding"
  model: EmbeddingModel
  reducers: EmbeddingModelAdapterReducers<EmbeddingModel>
}

export function EmbeddingModelAdapter<EmbeddingModel>(
  reducers: Omit<EmbeddingModelAdapterReducers<EmbeddingModel>, "kind">,
): (embeddingModel: EmbeddingModel) => EmbeddingModelAdapter<EmbeddingModel> {
  return (model) => ({
    adapter: "Embedding",
    model,
    reducers,
  })
}

export type AdapterActionReducer<R extends Array<unknown>> = (state: ExecState, ...rest: R) => PromiseOr<ExecState>
