import type { EmbeddingModelAdapter, LanguageModelAdapter } from "./StateReducers/StateReducers.js"
import type { ExtractSpec } from "./Spec.js"
import type { Expand } from "./util/Expand.js"
import type { ActionEvent } from "./Action/ActionEvent.js"
import type { ActionLike } from "./Action/Action.js"

export type ExecEventHandler = (event: ActionEvent) => any

export interface ExecConfig {
  handler?: ExecEventHandler
  models: {
    language?: Record<string, LanguageModelAdapter>
    embedding?: Record<string, EmbeddingModelAdapter>
  }
}

export type NarrowExecConfig<Y extends ActionLike, S extends ExtractSpec<Y> = ExtractSpec<Y>> = {
  handler?: (event: S["Event"]) => any
  models: Expand<
    ([S["LanguageModel"]] extends [never]
      ? { language?: never }
      : {
          language: {
            [K in S["LanguageModel"]]: LanguageModelAdapter
          }
        }) &
      ([S["EmbeddingModel"]] extends [never]
        ? { embedding?: never }
        : {
            embedding: {
              [K in S["EmbeddingModel"]]: EmbeddingModelAdapter
            }
          })
  >
}
