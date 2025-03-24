import type { ActionReducers, ExecStateReducer, ProviderReducers } from "./ActionReducers.js"
import { reduceBranch } from "./reduceBranch.js"
import { reduceContext } from "./reduceContext.js"
import { reduceDisableTool } from "./reduceDisableTool.js"
import { reduceEmit } from "./reduceEmit.js"
import { reduceMessages } from "./reduceMessages.js"
import { reduceModel } from "./reduceModel.js"
import { reduceTool } from "./reduceTool.js"

export function createReducers<Message>(providerReducers: ProviderReducers<Message>): ActionReducers {
  return {
    ...providerReducers,
    reduceBranch: reduceBranch,
    reduceContext: reduceContext,
    reduceEmit: reduceEmit,
    reduceTool: reduceTool,
    reduceModel: reduceModel,
    reduceDisableTool: reduceDisableTool,
    reduceMessages: reduceMessages,
  }
}
