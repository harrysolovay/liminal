import type { IteratorLike } from "../util/IteratorLike.ts"
import type { ActionLike } from "./ActionLike.ts"

export type Actor<Y extends ActionLike = ActionLike, R = any> = IteratorLike<Y, R>
