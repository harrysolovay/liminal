import { ActionBase } from "../Action/ActionBase.js"
import { assert } from "../util/assert.js"
import type { ActionReducer } from "./ActionReducer.js"
import { reduceBranch } from "./reduceBranch.js"
import { reduceContext } from "./reduceContext.js"
import { reduceCurrentState } from "./reduceCurrentState.js"
import { reduceToolRemoval } from "./reduceToolRemoval.js"
import { reduceEmit } from "./reduceEmit.js"
import { reduceMessage } from "./reduceMessage.js"
import { reduceModel } from "./reduceModel.js"
import { reduceTool } from "./reduceTool.js"

export const reduceAction: ActionReducer = (state, action) => {
  if (!action) {
    return {
      ...state,
      next: undefined,
    }
  } else if (typeof action === "string") {
    return reduceMessage(
      state,
      ActionBase("UserMessage", {
        content: action,
      }),
    )
  }
  switch (action.action) {
    case "AssistantMessage":
    case "SystemMessage":
    case "ToolMessage":
    case "UserMessage": {
      return reduceMessage(state, action)
    }
    case "Generation": {
      assert(state.model.language)
      const reduceGeneration = state.config.models.language?.[state.model.language]
      assert(reduceGeneration)
      return reduceGeneration(state, action)
    }
    case "Embedding": {
      assert(state.model.embedding)
      const reduceEmbedding = state.config.models.embedding?.[state.model.embedding]
      assert(reduceEmbedding)
      return reduceEmbedding(state, action)
    }
    case "Branch": {
      return reduceBranch(state, action)
    }
    case "Context": {
      return reduceContext(state, action)
    }
    case "DisableTool": {
      return reduceToolRemoval(state, action)
    }
    case "Emit": {
      return reduceEmit(state, action)
    }
    case "CurrentState": {
      return reduceCurrentState(state, action)
    }
    case "Model": {
      return reduceModel(state, action)
    }
    case "Tool": {
      return reduceTool(state, action)
    }
  }
}
