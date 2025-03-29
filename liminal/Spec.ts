import type { Action } from "./Action/Action.js"
import type { ActionLike } from "./Action/ActionLike.js"
import type { ActionEvent } from "./Action/ActionEvent.js"

export interface Spec {
  LanguageModel: string
  EmbeddingModel: string
  Event: ActionEvent
}

// TODO: string | Array<string | Message>
export type ExtractSpec<Y extends ActionLike> = MergeSpec<Extract<Y, Action>[""]>

export type MergeSpec<S extends Spec> = {
  LanguageModel: S["LanguageModel"]
  EmbeddingModel: S["EmbeddingModel"]
  Event: S["Event"]
}
