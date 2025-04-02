import type { Actor } from "../Actor/Actor.ts"
import type { DeferredOr } from "../util/DeferredOr.ts"
import type { ActionLike } from "./ActionLike.ts"

export type ActorLike<Y extends ActionLike = ActionLike, R = any> = DeferredOr<Actor<Y, R>>
