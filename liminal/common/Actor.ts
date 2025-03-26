import type { ActionLike } from "../Action/Action.js"
import type { IteratorLike } from "../util/IteratorLike.js"

export type Actor<Y extends ActionLike = ActionLike, R = any> = IteratorLike<Y, R>
