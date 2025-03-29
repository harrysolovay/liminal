import type { ActionLike } from "../Action/Action.js"
import type { State } from "../State.js"
import type { PromiseOr } from "../util/PromiseOr.js"

export type ActionReducer<A extends ActionLike = ActionLike> = (state: State, action: A) => PromiseOr<State>
