import type { ActionLike } from "../Action/Action.js"
import type { ExecState } from "../ExecState.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { StateReducers } from "./StateReducers.js"

export type ActionReducer<A extends ActionLike> = (
  this: StateReducers,
  state: ExecState,
  action: A,
) => PromiseOr<ExecState>
