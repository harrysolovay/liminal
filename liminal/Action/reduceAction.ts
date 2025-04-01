import { ActionBase } from "../Action/ActionBase.ts"
import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceArg } from "../Arg/reduceArg.ts"
import { reduceContext } from "../Context/reduceContext.ts"
import { reduceDisableTool } from "../DisableTool/reduceDisableTool.ts"
import { reduceEmbed } from "../Embed/reduceEmbed.ts"
import { reduceEmit } from "../Emit/reduceEmit.ts"
import { reduceEnableTool } from "../EnableTool/reduceEnableTool.ts"
import { reduceFork } from "../Fork/reduceFork.ts"
import { reduceInfer } from "../Infer/reduceInfer.ts"
import { reduceMessage } from "../Message/reduceMessage.ts"
import { reduceSetEmbeddingModel } from "../SetEmbeddingModel/reduceSetEmbeddingModel.ts"
import { reduceSetLanguageModel } from "../SetLanguageModel/reduceSetLanguageModel.ts"

export const reduceAction: ActionReducer = async (action, scope) => {
  if (!action) {
    return scope.spread({
      next: undefined,
    })
  } else if (typeof action === "string") {
    return reduceMessage(
      ActionBase("user_message", {
        content: action,
      }),
      scope,
    )
  }
  switch (action.action) {
    case "assistant_message":
    case "system_message":
    case "tool_message":
    case "user_message": {
      return reduceMessage(action, scope)
    }
    case "infer": {
      return reduceInfer(action, scope)
    }
    case "embed": {
      return reduceEmbed(action, scope)
    }
    case "fork": {
      return reduceFork(action, scope)
    }
    case "context": {
      return reduceContext(action, scope)
    }
    case "enable_tool": {
      return reduceEnableTool(action, scope)
    }
    case "disable_tool": {
      return reduceDisableTool(action, scope)
    }
    case "emit": {
      return reduceEmit(action, scope)
    }
    case "set_language_model": {
      return reduceSetLanguageModel(action, scope)
    }
    case "set_embedding_model": {
      return reduceSetEmbeddingModel(action, scope)
    }
    case "arg": {
      return reduceArg(action, scope)
    }
  }
}
