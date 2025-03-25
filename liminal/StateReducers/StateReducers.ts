import type { Action } from "../Action/Action.js"
import type { T } from "../Action/T.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
import type { Messages } from "../Action/Messages.js"
import type { Model } from "../Action/Model.js"
import type { Tool } from "../Action/Tool.js"
import type { ExecState } from "../ExecState.js"
import type { PromiseOr } from "../liminal_util/PromiseOr.js"
import { reduceAction } from "./reduceAction.js"
import { reduceBranch } from "./reduceBranch.js"
import { reduceContext } from "./reduceContext.js"
import { reduceDisableTool } from "./reduceDisableTool.js"
import { reduceEmit } from "./reduceEmit.js"
import { reduceMessages } from "./reduceMessages.js"
import { reduceModel } from "./reduceModel.js"
import { reduceState } from "./reduceState.js"
import { reduceTool } from "./reduceTool.js"

export function StateReducers<Model_, Message>(providerReducers: ProviderReducers<Model_, Message>): StateReducers {
  return {
    ...providerReducers,
    reduceState,
    reduceAction,
    reduceBranch,
    reduceContext,
    reduceEmit,
    reduceTool,
    reduceModel,
    reduceDisableTool,
    reduceMessages,
  }
}

export interface ProviderReducers<Model_ = any, Message = any> {
  reduceUserText: ActionReducer<Model_, Message, [userText: string]>
  reduceUserTexts: ActionReducer<Model_, Message, [userTexts: Array<string>]>
  reduceT: ActionReducer<Model_, Message, [t: T]>
}

export interface StateReducers<Model_ = any, Message = any> extends ProviderReducers<Model_, Message> {
  reduceState: ActionReducer<Model_, Message>
  reduceAction: ActionReducer<Model_, Message, [Action]>
  reduceModel: ActionReducer<Model_, Message, [Model]>
  reduceEmit: ActionReducer<Model_, Message, [Emit]>
  reduceBranch: ActionReducer<Model_, Message, [Branch]>
  reduceContext: ActionReducer<Model_, Message, [Context]>
  reduceMessages: ActionReducer<Model_, Message, [Messages]>
  reduceTool: ActionReducer<Model_, Message, [Tool]>
  reduceDisableTool: ActionReducer<Model_, Message, [DisableTool]>
}

export type ActionReducer<Model_ = any, Message = any, R extends Array<unknown> = []> = (
  this: StateReducers,
  state: ExecState<Model_, Message>,
  ...rest: R
) => PromiseOr<ExecState<Model_, Message>>
