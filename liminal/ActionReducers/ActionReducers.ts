import type { Action } from "../Action/Action.js"
import type { Assistant } from "../Action/Assistant.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
import type { Messages } from "../Action/Messages.js"
import type { Model } from "../Action/Model.js"
import type { Tool } from "../Action/Tool.js"
import type { ExecState } from "../ExecState.js"
import type { PromiseOr } from "../liminal_util/PromiseOr.js"

export interface ProviderReducers<Model = any, Message = any> {
  reduceUserText: ActionReducer<string, Model, Message>
  reduceUserTexts: ActionReducer<Array<string>, Model, Message>
  reduceAssistant: ActionReducer<Assistant, Model, Message>
}

export interface ActionReducers extends ProviderReducers {
  reduceModel: ActionReducer<Model>
  reduceEmit: ActionReducer<Emit>
  reduceBranch: ActionReducer<Branch>
  reduceContext: ActionReducer<Context>
  reduceMessages: ActionReducer<Messages>
  reduceTool: ActionReducer<Tool>
  reduceDisableTool: ActionReducer<DisableTool>
}

export type ActionReducer<A extends Action = Action, Model = any, Message = any> = (
  this: ActionReducers,
  state: ExecState<Model, Message>,
  action: A,
) => PromiseOr<ExecState<Model, Message>>

export type ExecStateReducer<Message = any> = (
  this: ActionReducers,
  state: ExecState<Message>,
) => PromiseOr<ExecState<Message>>
