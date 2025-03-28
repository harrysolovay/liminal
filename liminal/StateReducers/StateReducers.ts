import type { ActionLike } from "../Action/Action.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
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
import { reduceUserTexts } from "./reduceUserTexts.js"
import { reduceUserText } from "./reduceUserText.js"
import type { ActionReducer } from "./ActionReducer.js"
import type { Embedding } from "../Action/Embedding.js"
import type { Generation } from "../Action/Generation.js"

export type LanguageModelAdapter = ActionReducer<[Generation]>
export type EmbeddingModelAdapter = ActionReducer<[embedding: Embedding]>

export interface StateReducers {
  reduceState: ActionReducer<[]>
  reduceAction: ActionReducer<[ActionLike]>
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
