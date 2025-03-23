import type { Action } from "../Action/Action.js"
import type { IteratorLike } from "../liminal_util/IteratorLike.js"

export type Flow<Y extends Action = Action, R = any> = IteratorLike<Y, R>
