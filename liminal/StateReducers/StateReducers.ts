import type { Action } from "../Action/Action.js"
import type { Generation } from "../Action/Generation.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
import { reduceScope } from "./reduceScope.js"
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
import { reduceState } from "./reduceState.js"
import { reduceTool } from "./reduceTool.js"
import type { Embedding } from "../Action/Embedding.js"
import type { ExecSpec } from "../ExecSpec.js"
import { reduceModel } from "./reduceModel.js"
import type { Scope } from "../Action/Scope.js"

export function StateReducers<S extends ExecSpec>(providerReducers: ProviderReducers<S>): StateReducers {
  return {
    ...providerReducers,
    reduceState,
    reduceAction,
    reduceScope,
    reduceBranch,
    reduceContext,
    reduceEmit,
    reduceTool,
    reduceModel,
    reduceDisableTool,
    reduceMessages,
  }
}

export interface ProviderReducers<S extends ExecSpec = ExecSpec> {
  reduceUserText: ActionReducer<[userText: string], S>
  reduceUserTexts: ActionReducer<[userTexts: Array<string>], S>
  reduceGeneration: ActionReducer<[generation: Generation], S>
  reduceEmbedding: ActionReducer<[embedding: Embedding], S>
}

export interface StateReducers extends ProviderReducers {
  reduceState: ActionReducer<[]>
  reduceAction: ActionReducer<[Action]>
  reduceScope: ActionReducer<[Scope]>
  reduceModel: ActionReducer<[Model]>
  reduceEmit: ActionReducer<[Emit]>
  reduceBranch: ActionReducer<[Branch]>
  reduceContext: ActionReducer<[Context]>
  reduceMessages: ActionReducer<[Messages]>
  reduceTool: ActionReducer<[Tool]>
  reduceDisableTool: ActionReducer<[DisableTool]>
}

export type ActionReducer<R extends Array<unknown>, S extends ExecSpec = ExecSpec> = (
  this: StateReducers,
  state: ExecState<S>,
  ...rest: R
) => PromiseOr<ExecState<S>>
