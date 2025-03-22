import type { Action } from "../Action/Action.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { Flow } from "./Flow.js"

export type FlowLike<Y extends Action = Action, R = any> = DeferredOr<Flow<Y, R>>
