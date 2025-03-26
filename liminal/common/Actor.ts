import type { Action } from "../Action/Action.js"
import type { IteratorLike } from "../util/IteratorLike.js"

export type Actor<Y extends Action = Action, R = any> = IteratorLike<Y, R>
