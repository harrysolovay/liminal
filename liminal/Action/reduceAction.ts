import { ActionBase } from "../Action/ActionBase.ts"
import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceContext } from "../Context/reduceContext.ts"
import { reduceDeclareModel } from "../DeclareModel/reduceDeclareModel.ts"
import { reduceDisableTool } from "../DisableTool/reduceDisableTool.ts"
import { reduceEmit } from "../Emit/reduceEmit.ts"
import { reduceEnableTool } from "../EnableTool/reduceEnableTool.ts"
import { reduceFork } from "../Fork/reduceFork.ts"
import { reduceMessage } from "../Message/reduceMessage.ts"
import { assert } from "../util/assert.ts"

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
