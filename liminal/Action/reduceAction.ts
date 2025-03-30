import { ActionBase } from "../Action/ActionBase.js"
import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceBranches } from "../Branches/reduceBranches.js"
import { reduceContext } from "../Context/reduceContext.js"
import { reduceCurrentScope } from "../CurrentScope/reduceCurrentScope.js"
import { reduceEmission } from "../Emission/reduceEmit.js"
import { reduceMessage } from "../Message/reduceMessage.js"
import { reduceModel } from "../Model/reduceModel.js"
import { reduceTool } from "../Tool/reduceTool.js"
import { reduceToolRemoval } from "../ToolRemoval/reduceToolRemoval.js"
import { assert } from "../util/assert.js"

export const reduceAction: ActionReducer = (scope, action) => {
  if (!action) {
    return scope.spread({
      next: undefined,
    })
  } else if (typeof action === "string") {
    return reduceMessage(
      scope,
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
      return reduceMessage(scope, action)
    }
    case "Inference": {
      assert(scope.model.language)
      const lm = scope.models[scope.model.language]
      assert(lm?.adapter === "Language")
      return lm.reduceInference(scope, action)
    }
    case "Embedding": {
      assert(scope.model.embedding)
      const em = scope.models[scope.model.embedding]
      assert(em?.adapter === "Embedding")
      return em.reduceEmbedding(scope, action)
    }
    case "Branches": {
      return reduceBranches(scope, action)
    }
    case "Context": {
      return reduceContext(scope, action)
    }
    case "ToolRemoval": {
      return reduceToolRemoval(scope, action)
    }
    case "Emission": {
      return reduceEmission(scope, action)
    }
    case "CurrentScope": {
      return reduceCurrentScope(scope, action)
    }
    case "Model": {
      return reduceModel(scope, action)
    }
    case "Tool": {
      return reduceTool(scope, action)
    }
  }
}
