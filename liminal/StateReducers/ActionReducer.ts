import type { ExecState } from "../ExecState.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { StateReducers } from "./StateReducers.js"

export type ActionReducer<R extends Array<unknown>> = (
  this: StateReducers,
  state: ExecState,
  ...rest: R
) => PromiseOr<ExecState>
