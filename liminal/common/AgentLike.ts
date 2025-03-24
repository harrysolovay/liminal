import type { Action } from "../Action/Action.js"
import type { DeferredOr } from "../liminal_util/DeferredOr.js"
import type { Agent } from "./Agent.js"

export type AgentLike<Y extends Action = Action, R = any> = DeferredOr<Agent<Y, R>>
