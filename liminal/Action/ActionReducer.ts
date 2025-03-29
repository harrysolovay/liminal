import type { State } from "../State/State.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { ActionLike } from "./ActionLike.js"

export type ActionReducer<A extends ActionLike = ActionLike> = (state: State, action: A) => PromiseOr<State>
