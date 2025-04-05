import type { Action } from "./Action.ts"
import type { DeferredOr } from "./util/DeferredOr.ts"
import type { IteratorLike } from "./util/IteratorLike.ts"

export type Actor<Y extends Action = Action, R = any> = IteratorLike<Y, R>

export type ActorLike<Y extends Action = Action, R = any> = DeferredOr<Actor<Y, R>>
export type ActorLikeY<A extends ActorLike> = A extends ActorLike<infer Y> ? Y : never
export type ActorLikeT<A extends ActorLike> = A extends ActorLike<Action, infer Y> ? Y : never

export type ActorLikes = ActorLikeArray | ActorLikeRecord
export type ActorLikeArray = Array<ActorLike>
export type ActorLikeRecord = Record<string, ActorLike>

export type ActorLikesT<A extends ActorLikes> =
  & {
    -readonly [K in keyof A]: A[K] extends ActorLike<Action, infer T> ? T : never
  }
  & {}
