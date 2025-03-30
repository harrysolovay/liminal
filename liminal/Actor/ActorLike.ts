import type { ActionLike } from "../Action/ActionLike.js"
import type { Actor } from "../Actor/Actor.js"
import type { DeferredOr } from "../util/DeferredOr.js"

export type ActorLike<Y extends ActionLike = ActionLike, R = any> = DeferredOr<Actor<Y, R>>
