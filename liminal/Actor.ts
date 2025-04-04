import type { ActionLike } from "./Action.ts"
import type { DeferredOr } from "./util/DeferredOr.ts"
import type { IteratorLike } from "./util/IteratorLike.ts"

export type Actor<Y extends ActionLike = ActionLike, R = any> = IteratorLike<Y, R>

export type ActorLike<Y extends ActionLike = ActionLike, R = any> = DeferredOr<Actor<Y, R>>

export type ActorLikes = ActorLikeArray | ActorLikeRecord
export type ActorLikeArray = Array<ActorLike>
export type ActorLikeRecord = Record<string, ActorLike>

export type ActorLikesY<A extends ActorLikes> = {
  [L in keyof A]: A[L] extends ActorLike<infer Y> ? Y : never
}[keyof A]
