import type { ActionLike } from "../Action/ActionLike.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { DeferredOr } from "../util/DeferredOr.ts"

export type ActorLike<Y extends ActionLike = ActionLike, R = any> = DeferredOr<Actor<Y, R>>
