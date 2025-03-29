import type { ActionLike } from "../Action/Action.js"
import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { DisableTool } from "../Action/DisableTool.js"
import type { Emit } from "../Action/Emit.js"
import type { CurrentContext } from "../Action/CurrentContext.js"
import type { Model } from "../Action/Model.js"
import type { Tool } from "../Action/Tool.js"
import { reduceAction } from "./reduceAction.js"
import { reduceBranch } from "./reduceBranch.js"
import { reduceContext } from "./reduceContext.js"
import { reduceDisableTool } from "./reduceDisableTool.js"
import { reduceEmit } from "./reduceEmit.js"
import { reduceCurrentContext } from "./reduceCurrentContext.js"
import { reduceTool } from "./reduceTool.js"
import { reduceModel } from "./reduceModel.js"
import type { ActionReducer } from "./ActionReducer.js"
import type { Embedding } from "../Action/Embedding.js"
import type { Generation } from "../Action/Generation.js"
import type { UserMessage } from "../Action/UserMessage.js"
import type { AssistantMessage } from "../Action/AssistantMessage.js"
import type { SystemMessage } from "../Action/SystemMessage.js"
import type { ToolMessage } from "../Action/ToolMessage.js"
import { reduceMessage } from "./reduceMessage.js"

export type LanguageModelAdapter = ActionReducer<Generation>
export type EmbeddingModelAdapter = ActionReducer<Embedding>

export interface StateReducers {
  reduceAction: ActionReducer<ActionLike>
  reduceMessage: ActionReducer<UserMessage | AssistantMessage | ToolMessage | SystemMessage>
  reduceModel: ActionReducer<Model>
  reduceEmit: ActionReducer<Emit>
  reduceBranch: ActionReducer<Branch>
  reduceContext: ActionReducer<Context>
  reduceCurrentContext: ActionReducer<CurrentContext>
  reduceTool: ActionReducer<Tool>
  reduceDisableTool: ActionReducer<DisableTool>
}

export const StateReducers: StateReducers = {
  reduceAction,
  reduceMessage,
  reduceBranch,
  reduceContext,
  reduceEmit,
  reduceTool,
  reduceModel,
  reduceDisableTool,
  reduceCurrentContext,
}
