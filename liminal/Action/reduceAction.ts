import { ActionBase } from "../Action/ActionBase.js"
import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceBranches } from "../Branches/reduceBranches.js"
import { reduceContext } from "../Context/reduceContext.js"
import { reduceCurrentState } from "../CurrentState/reduceCurrentState.js"
import { reduceEmit } from "../Emit/reduceEmit.js"
import { reduceMessage } from "../Message/reduceMessage.js"
import { reduceModel } from "../Model/reduceModel.js"
import { reduceTool } from "../Tool/reduceTool.js"
import { reduceToolRemoval } from "../ToolRemoval/reduceToolRemoval.js"
import { assert } from "../util/assert.js"

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
    case "Branches": {
      return reduceBranches(state, action)
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
