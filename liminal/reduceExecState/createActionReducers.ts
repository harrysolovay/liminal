import type { ActionReducers, ProviderReducers } from "./ActionReducers.js"
import { reduceAction } from "./reduceAction.js"
import { reduceBranch } from "./reduceBranch.js"
import { reduceContext } from "./reduceContext.js"
import { reduceDisableTool } from "./reduceDisableTool.js"
import { reduceEmit } from "./reduceEmit.js"
import { reduceMessages } from "./reduceMessages.js"
import { reduceModel } from "./reduceModel.js"
import { reduceTool } from "./reduceTool.js"

export function createActionReducers<Model_, Message>(
  providerReducers: ProviderReducers<Model_, Message>,
): ActionReducers {
  return {
    ...providerReducers,
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
