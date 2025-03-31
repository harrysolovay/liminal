import type { Action } from "./Action/Action.ts"
import type { ActionEvent } from "./Action/ActionEvent.ts"
import type { ActionLike } from "./Action/ActionLike.ts"

export interface Spec {
  LanguageModel: keyof any
  EmbeddingModel: keyof any
  Event: ActionEvent
}

// TODO: string | Array<string | Message>
export type ExtractSpec<Y extends ActionLike> = MergeSpec<Extract<Y, Action>[""]>

export type MergeSpec<S extends Spec> = {
  LanguageModel: S["LanguageModel"]
  EmbeddingModel: S["EmbeddingModel"]
  Event: S["Event"]
}
