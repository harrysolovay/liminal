import type { Action } from "../Action/Action.js"
import type { IteratorLike } from "../util/IteratorLike.js"

export type FlowLike<Y extends Action = Action, O = any> = IteratorLike<Y, O>
