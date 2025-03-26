import type { ActionLike } from "../Action/Action.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { Actor } from "./Actor.js"

export type ActorLike<Y extends ActionLike = ActionLike, R = any> = DeferredOr<Actor<Y, R>>
