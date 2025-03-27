import type { ReduceEmbedding, ReduceGeneration } from "./StateReducers/StateReducers.js"
import type { ExtractSpec } from "./Spec.js"
import type { Expand } from "./util/Expand.js"
import type { ActionEvent } from "./Action/ActionEvent.js"
import type { ActionLike } from "./Action/Action.js"

export interface ExecConfig {
  handler?: (event: ActionEvent) => any
  models: {
    language: LanguageModelsConfig
    embedding?: Record<string, ReduceEmbedding>
  }
  signal?: AbortSignal
}

export interface LanguageModelsConfig {
  default: ReduceGeneration
}

export type NarrowExecConfig<Y extends ActionLike, S extends ExtractSpec<Y> = ExtractSpec<Y>> = {
  handler?: (event: S["Event"]) => any
  models: Expand<
    {
      language: Expand<
        {
          default: ReduceGeneration
        } & ([S["LanguageModel"]] extends [never]
          ? {}
          : {
              [K in S["LanguageModel"]]: ReduceGeneration
            })
      >
    } & ([S["EmbeddingModel"]] extends [never]
      ? {
          embedding?: never
        }
      : {
          embedding: Record<S["EmbeddingModel"], ReduceEmbedding>
        })
  >
  signal?: AbortSignal
}
