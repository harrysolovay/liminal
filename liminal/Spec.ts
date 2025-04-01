import type { Action } from "./Action/Action.ts"
import type { ActionEvent } from "./Action/ActionEvent.ts"
import type { ActionLike } from "./Action/ActionLike.ts"

export interface Spec {
  Field: Record<keyof any, any>
  Event: ActionEvent
}

// TODO: string | Array<string | Message>
export type ExtractSpec<Y extends ActionLike> = MergeSpec<Extract<Y, Action>[""]>

export type MergeSpec<S extends Spec> = {
  Field: S["Field"]
  Event: S["Event"]
}
