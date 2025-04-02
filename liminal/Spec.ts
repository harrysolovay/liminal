import type { Action } from "./Action/Action.ts"
import type { ActionEvent } from "./Action/ActionEvent.ts"
import type { ActionLike } from "./Action/ActionLike.ts"
import type { Message } from "./messages/Message.ts"

export interface Spec {
  Field: Record<keyof any, any>
  Event: ActionEvent
}

export type ExtractSpec<Y extends ActionLike> = MergeSpec<
  (
    | Extract<Y, Action>
    | Extract<Y, Array<Message>>[number]
  )[""]
>

export type MergeSpec<S extends Spec> = {
  Field: S["Field"]
  Event: S["Event"]
}
