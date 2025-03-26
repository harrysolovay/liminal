import type { Action } from "../Action/Action.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { Actor } from "./Actor.js"

export type ActorLike<Y extends Action = Action, R = any> = DeferredOr<Actor<Y, R>>
