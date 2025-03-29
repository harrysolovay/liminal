import type { ActionEvent } from "./Action/ActionEvent.js"
import type { ActionLike } from "./Action/ActionLike.js"
import type { EmbeddingModelAdapter, LanguageModelAdapter } from "./Adapters.js"
import type { ExtractSpec, Spec } from "./Spec.js"
import type { Expand } from "./util/Expand.js"

export type EventHandler = (event: ActionEvent) => any

export interface Config {
  handler?: EventHandler
  models: {
    language?: Record<string, LanguageModelAdapter>
    embedding?: Record<string, EmbeddingModelAdapter>
  }
}

export type ExtractConfig<Y extends ActionLike> = ExtractSpec<Y> extends infer S extends Spec ? {
    handler?: (event: S["Event"]) => any
    models: Expand<
      & ([S["LanguageModel"]] extends [never] ? { language?: never }
        : {
          language: {
            [K in S["LanguageModel"]]: LanguageModelAdapter
          }
        })
      & ([S["EmbeddingModel"]] extends [never] ? { embedding?: never }
        : {
          embedding: {
            [K in S["EmbeddingModel"]]: EmbeddingModelAdapter
          }
        })
    >
  }
  : never
