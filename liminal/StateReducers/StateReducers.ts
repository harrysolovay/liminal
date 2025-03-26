import type { Action } from "../Action/Action.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
import { reduceScope } from "./reduceScope.js"
import type { Messages } from "../Action/Messages.js"
import type { Model } from "../Action/Model.js"
import type { Tool } from "../Action/Tool.js"
import { reduceAction } from "./reduceAction.js"
import { reduceBranch } from "./reduceBranch.js"
import { reduceContext } from "./reduceContext.js"
import { reduceDisableTool } from "./reduceDisableTool.js"
import { reduceEmit } from "./reduceEmit.js"
import { reduceMessages } from "./reduceMessages.js"
import { reduceState } from "./reduceState.js"
import { reduceTool } from "./reduceTool.js"
import { reduceModel } from "./reduceModel.js"
import type { Scope } from "../Action/Scope.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { ExecState } from "../ExecState.js"
import { reduceUserTexts } from "./reduceUserTexts.js"
import { reduceUserText } from "./reduceUserText.js"

export interface StateReducers {
  reduceState: ActionReducer<[]>
  reduceAction: ActionReducer<[Action]>
  reduceScope: ActionReducer<[Scope]>
  reduceUserText: ActionReducer<[string]>
  reduceUserTexts: ActionReducer<[Array<string>]>
  reduceModel: ActionReducer<[Model]>
  reduceEmit: ActionReducer<[Emit]>
  reduceBranch: ActionReducer<[Branch]>
  reduceContext: ActionReducer<[Context]>
  reduceMessages: ActionReducer<[Messages]>
  reduceTool: ActionReducer<[Tool]>
  reduceDisableTool: ActionReducer<[DisableTool]>
}

export const StateReducers: StateReducers = {
  reduceState,
  reduceAction,
  reduceScope,
  reduceUserText,
  reduceUserTexts,
  reduceBranch,
  reduceContext,
  reduceEmit,
  reduceTool,
  reduceModel,
  reduceDisableTool,
  reduceMessages,
}

export type ActionReducer<R extends Array<unknown>> = (
  this: StateReducers,
  state: ExecState,
  ...rest: R
) => PromiseOr<ExecState>
