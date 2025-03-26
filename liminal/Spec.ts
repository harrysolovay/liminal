import type { Action, ActionLike } from "./Action/Action.js"
import type { ActionEvent } from "./Action/ActionEvent.js"
import type { Actor } from "./common/Actor.js"

export interface Spec {
  LanguageModel: string
  EmbeddingModel: string
  Event: ActionEvent
}

export type ExtractSpec<R> = R extends Actor<infer Y>
  ? Extract<Y, Action>[""]
  : {
      LanguageModel: never
      EmbeddingModel: never
      Event: never
    }
