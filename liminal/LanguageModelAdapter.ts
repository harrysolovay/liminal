import type { Generation } from "./Action/Generation.js"
import type { ActionReducer } from "./StateReducers/ActionReducer.js"

export type ReduceGeneration<LanguageModel> = ActionReducer<[generation: Generation], LanguageModel>

export interface LanguageModelAdapter<LanguageModel = any> {
  adapter: "Language"
  model: LanguageModel
  reduceGeneration: ReduceGeneration<LanguageModel>
}

export function LanguageModelAdapter<LanguageModel>(
  reduceGeneration: ReduceGeneration<LanguageModel>,
): (embeddingModel: LanguageModel) => LanguageModelAdapter {
  return (model) => ({
    adapter: "Language",
    model,
    reduceGeneration,
  })
}
