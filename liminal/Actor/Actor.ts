import type { ActionLike } from "../Action/ActionLike.ts"
import type { IteratorLike } from "../util/IteratorLike.ts"

export type Actor<Y extends ActionLike = ActionLike, R = any> = IteratorLike<Y, R>
