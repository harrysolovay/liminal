import type { Action } from "./Action/Action.js"
import type { ActionEvent } from "./Action/ActionEvent.js"
import type { Falsy } from "./util/Falsy.js"

export interface Spec<LM extends string = string, EM extends string = string, E extends ActionEvent = ActionEvent> {
  Model: {
    language: LM
    embedding: EM
  }
  Event: E
}

export type ExtractSpec<Y extends Action> = Exclude<Y, Falsy | string | Array<string>>
