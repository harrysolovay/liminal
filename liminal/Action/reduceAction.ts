import { ActionBase } from "../Action/ActionBase.ts"
import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import { reduceContext } from "../Context/reduceContext.ts"
import { reduceDisableTool } from "../DisableTool/reduceDisableTool.ts"
import { reduceEmit } from "../Emit/reduceEmit.ts"
import { reduceEnableTool } from "../EnableTool/reduceEnableTool.ts"
import { reduceFork } from "../Fork/reduceFork.ts"
import { reduceMessage } from "../Message/reduceMessage.ts"
import { reduceSetEmbeddingModel } from "../SetEmbeddingModel/reduceSetEmbeddingModel.ts"
import { reduceSetLanguageModel } from "../SetLanguageModel/reduceSetLanguageModel.ts"
import { assert } from "../util/assert.ts"

export const reduceAction: ActionReducer = async (scope, action) => {
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
      assert(scope.infer)
      scope.events.emit({
        type: "inference_requested",
      })
      scope = await reduceActor(scope, scope.infer(scope, action))
      scope.events.emit({
        type: "inferred",
        value: scope.result,
      })
      return scope.spread({
        next: scope.result,
      })
    }
    case "embed": {
      assert(scope.embed)
      scope.events.emit({
        type: "embedding_requested",
        value: action.value,
      })
      scope = await reduceActor(scope, scope.embed(scope, action))
      scope.events.emit({
        type: "embedded",
        value: action.value,
        embedding: scope.result,
      })
      return scope.spread({
        next: scope.result,
      })
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
    case "set_language_model": {
      return reduceSetLanguageModel(scope, action)
    }
    case "set_embedding_model": {
      return reduceSetEmbeddingModel(scope, action)
    }
  }
}
