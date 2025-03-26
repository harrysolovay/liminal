import type { ActionLike } from "../Action/Action.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
import type { Messages } from "../Action/Messages.js"
import type { LanguageModel } from "../Action/LanguageModel.js"
import type { EmbeddingModel } from "../Action/EmbeddingModel.js"
import type { Tool } from "../Action/Tool.js"
import { reduceAction } from "./reduceAction.js"
import { reduceBranch } from "./reduceBranch.js"
import { reduceContext } from "./reduceContext.js"
import { reduceDisableTool } from "./reduceDisableTool.js"
import { reduceEmit } from "./reduceEmit.js"
import { reduceMessages } from "./reduceMessages.js"
import { reduceState } from "./reduceState.js"
import { reduceTool } from "./reduceTool.js"
import { reduceLanguageModel } from "./reduceLanguageModel.js"
import { reduceEmbeddingModel } from "./reduceEmbeddingModel.js"
import { reduceUserTexts } from "./reduceUserTexts.js"
import { reduceUserText } from "./reduceUserText.js"
import type { ActionReducer } from "./ActionReducer.js"

export interface StateReducers {
  reduceState: ActionReducer<[]>
  reduceAction: ActionReducer<[ActionLike]>
  reduceUserText: ActionReducer<[string]>
  reduceUserTexts: ActionReducer<[Array<string>]>
  reduceLanguageModel: ActionReducer<[LanguageModel]>
  reduceEmbeddingModel: ActionReducer<[EmbeddingModel]>
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
  reduceLanguageModel,
  reduceEmbeddingModel,
  reduceDisableTool,
  reduceMessages,
}
