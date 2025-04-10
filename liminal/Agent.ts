import type { Action } from "./Action.ts"
import type { DeferredOr } from "./util/DeferredOr.ts"
import type { IteratorLike } from "./util/IteratorLike.ts"

export type Agent<Y extends Action = Action, R = any> = IteratorLike<Y, R>

export type AgentLike<Y extends Action = Action, R = any> = DeferredOr<Agent<Y, R>>

export type AgentLikeY<A extends AgentLike> = A extends AgentLike<infer Y> ? Y : never
export type AgentLikeT<A extends AgentLike> = A extends AgentLike<Action, infer T> ? T : never
