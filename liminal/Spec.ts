import type { Action } from "./Action.ts"
import type { ActionEvent } from "./ActionEvent.ts"
import type { Message } from "./actions/Message.ts"
import type { ActionLike } from "./Actor/ActionLike.ts"

export interface Spec {
  Entry: [keyof any, any]
  Event: ActionEvent
}

export type ExtractSpec<Y extends ActionLike> = MergeSpec<
  (
    | Extract<Y, Action>
    | Extract<Y, Array<Message>>[number]
  )[""]
>

export type MergeSpec<S extends Spec> = {
  Entry: S["Entry"]
  Event: S["Event"]
}
