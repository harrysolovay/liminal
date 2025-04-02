import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceArg } from "../Arg/reduceArg.ts"
import { reduceContext } from "../Context/reduceContext.ts"
import { reduceDisableTool } from "../DisableTool/reduceDisableTool.ts"
import { reduceEmbed } from "../Embed/reduceEmbed.ts"
import { reduceEmit } from "../Emit/reduceEmit.ts"
import { reduceEnableTool } from "../EnableTool/reduceEnableTool.ts"
import { reduceFork } from "../Fork/reduceFork.ts"
import { reduceGetScope } from "../GetScope/reduceGetScope.ts"
import { reduceInfer } from "../Infer/reduceInfer.ts"
import { reduceAssistantMessage } from "../messages/AssistantMessage/reduceAssistantMessage.ts"
import { reduceSystemMessage } from "../messages/SystemMessage/reduceSystemMessage.ts"
import { reduceToolMessage } from "../messages/ToolMessage/reduceToolMessage.ts"
import { reduceUserMessage } from "../messages/UserMessage/reduceUserMessage.ts"
import { reduceSetEmbeddingModel } from "../SetEmbeddingModel/reduceSetEmbeddingModel.ts"
import { reduceSetLanguageModel } from "../SetLanguageModel/reduceSetLanguageModel.ts"

export const reduceAction: ActionReducer = async (action, scope) => {
  if (!action) {
    return scope.spread({
      next: undefined,
    })
  }
  if (Array.isArray(action)) {
    return scope.spread({
      messages: [...scope.messages, ...action],
      next: undefined,
    })
  }
  switch (action.action) {
    case "assistant_message": {
      return reduceAssistantMessage(action, scope)
    }
    case "system_message": {
      return reduceSystemMessage(action, scope)
    }
    case "tool_message": {
      return reduceToolMessage(action, scope)
    }
    case "user_message": {
      return reduceUserMessage(action, scope)
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
    case "get_scope": {
      return reduceGetScope(action, scope)
    }
  }
}
