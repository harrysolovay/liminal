import type { Action } from "../Action/Action.js"
import type { IteratorLike } from "../liminal_util/IteratorLike.js"

export type Agent<Y extends Action = Action, R = any> = IteratorLike<Y, R>
