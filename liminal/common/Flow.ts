import type { Action } from "../Action/Action.js"
import type { IteratorLike } from "../util/IteratorLike.js"

export type Flow<Y extends Action = Action, O = any> = IteratorLike<Y, O>
