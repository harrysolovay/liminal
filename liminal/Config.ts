import type { ActionEvent } from "./Action/ActionEvent.js"
import type { Adapter, EmbeddingModelAdapter, LanguageModelAdapter } from "./Adapters.js"
import type { Spec } from "./Spec.js"
import type { Expand } from "./util/Expand.js"

export type EventHandler = (event: ActionEvent) => any

export type ModelAdapters = Record<string, Adapter>

export type ExtractModelAdapters<S extends Spec> = Expand<
  & ([S["LanguageModel"]] extends [never] ? {}
    : { [K in S["LanguageModel"]]: LanguageModelAdapter })
  & ([S["EmbeddingModel"]] extends [never] ? {}
    : { [K in S["EmbeddingModel"]]: EmbeddingModelAdapter })
>
