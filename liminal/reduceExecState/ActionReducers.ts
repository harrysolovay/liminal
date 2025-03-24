import type { Action } from "../Action/Action.js"
import type { Completion } from "../Action/Assistant.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
import type { Messages } from "../Action/Messages.js"
import type { Model } from "../Action/Model.js"
import type { Tool } from "../Action/Tool.js"
import type { ExecState } from "../ExecState.js"
import type { PromiseOr } from "../liminal_util/PromiseOr.js"

export interface ProviderReducers<Model_ = any, Message = any> {
  reduceUserText: ActionReducer<string, Model_, Message>
  reduceUserTexts: ActionReducer<Array<string>, Model_, Message>
  reduceAssistant: ActionReducer<Completion, Model_, Message>
}

export interface ActionReducers<Model_ = any, Message = any> extends ProviderReducers<Model_, Message> {
  reduceAction: ActionReducer<Action, Model_, Message>
  reduceModel: ActionReducer<Model, Model_, Message>
  reduceEmit: ActionReducer<Emit, Model_, Message>
  reduceBranch: ActionReducer<Branch, Model_, Message>
  reduceContext: ActionReducer<Context, Model_, Message>
  reduceMessages: ActionReducer<Messages, Model_, Message>
  reduceTool: ActionReducer<Tool, Model_, Message>
  reduceDisableTool: ActionReducer<DisableTool, Model_, Message>
}

export type ActionReducer<A extends Action = Action, Model_ = any, Message = any> = (
  this: ActionReducers,
  state: ExecState<Model_, Message>,
  action: A,
) => PromiseOr<ExecState<Model_, Message>>
