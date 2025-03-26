import type { ExecState } from "../ExecState.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { StateReducers } from "./StateReducers.js"

export type ActionReducer<R extends Array<unknown>, LanguageModel = any, EmbeddingModel = any> = (
  this: StateReducers,
  state: ExecState<LanguageModel, EmbeddingModel>,
  ...rest: R
) => PromiseOr<ExecState>
