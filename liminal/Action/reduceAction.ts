import { ActionBase } from "../Action/ActionBase.js"
import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceContext } from "../Context/reduceContext.js"
import { reduceDeclareModel } from "../DeclareModel/reduceDeclareModel.js"
import { reduceDisableTool } from "../DisableTool/reduceDisableTool.js"
import { reduceEmit } from "../Emit/reduceEmit.js"
import { reduceEnableTool } from "../EnableTool/reduceEnableTool.js"
import { reduceFork } from "../Fork/reduceFork.js"
import { reduceMessage } from "../Message/reduceMessage.js"
import { assert } from "../util/assert.js"

export const reduceAction: ActionReducer = (scope, action) => {
  if (!action) {
    return scope.spread({
      next: undefined,
    })
  } else if (typeof action === "string") {
    return reduceMessage(
      scope,
      ActionBase("user_message", {
        content: action,
      }),
    )
  }
  switch (action.action) {
    case "assistant_message":
    case "system_message":
    case "tool_message":
    case "user_message": {
      return reduceMessage(scope, action)
    }
    case "infer": {
      assert(scope.model.language)
      const lm = scope.models[scope.model.language]
      assert(lm?.type === "Language")
      return lm.reduceInference(scope, action)
    }
    case "embed": {
      assert(scope.model.embedding)
      const em = scope.models[scope.model.embedding]
      assert(em?.type === "Embedding")
      return em.reduceEmbedding(scope, action)
    }
    case "fork": {
      return reduceFork(scope, action)
    }
    case "context": {
      return reduceContext(scope, action)
    }
    case "enable_tool": {
      return reduceEnableTool(scope, action)
    }
    case "disable_tool": {
      return reduceDisableTool(scope, action)
    }
    case "emit": {
      return reduceEmit(scope, action)
    }
    case "declare_model": {
      return reduceDeclareModel(scope, action)
    }
  }
}
