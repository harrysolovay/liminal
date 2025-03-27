import type { ReduceEmbedding, ReduceGeneration } from "./StateReducers/StateReducers.js"
import type { ExtractSpec } from "./Spec.js"
import type { Expand } from "./util/Expand.js"
import type { ActionEvent } from "./Action/ActionEvent.js"
import type { ActionLike } from "./Action/Action.js"

export interface ExecConfig {
  handler?: (event: ActionEvent) => any
  models: {
    language?: Record<string, ReduceGeneration>
    embedding?: Record<string, ReduceEmbedding>
  }
  signal?: AbortSignal
}

export type NarrowExecConfig<Y extends ActionLike, S extends ExtractSpec<Y> = ExtractSpec<Y>> = {
  handler?: (event: S["Event"]) => any
  models: Expand<
    ([S["LanguageModel"]] extends [never]
      ? {
          language?: never
        }
      : {
          language: {
            [K in S["LanguageModel"]]: ReduceGeneration
          }
        }) &
      ([S["EmbeddingModel"]] extends [never]
        ? {
            embedding?: never
          }
        : {
            [K in S["EmbeddingModel"]]: ReduceGeneration
          })
  >
  signal?: AbortSignal
}
