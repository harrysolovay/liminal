import type { ActionLike } from "../Action/Action.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { ExecState } from "../ExecState.js"
import { assert } from "../util/assert.js"
import type { StateReducers } from "./StateReducers.js"

export function reduceAction(this: StateReducers, state: ExecState, action: ActionLike) {
  if (!action) {
    return {
      ...state,
      next: undefined,
    }
  } else if (typeof action === "string") {
    return this.reduceMessage(
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
      return this.reduceMessage(state, action)
    }
    case "Generation": {
      assert(state.model.language)
      const reduceGeneration = state.config.models.language?.[state.model.language]
      assert(reduceGeneration)
      return reduceGeneration.call(this, state, action)
    }
    case "Embedding": {
      assert(state.model.embedding)
      const reduceEmbedding = state.config.models.embedding?.[state.model.embedding]
      assert(reduceEmbedding)
      return reduceEmbedding.call(this, state, action)
    }
    case "Branch": {
      return this.reduceBranch(state, action)
    }
    case "Context": {
      return this.reduceContext(state, action)
    }
    case "DisableTool": {
      return this.reduceDisableTool(state, action)
    }
    case "Emit": {
      return this.reduceEmit(state, action)
    }
    case "CurrentContext": {
      return this.reduceCurrentContext(state, action)
    }
    case "Model": {
      return this.reduceModel(state, action)
    }
    case "Tool": {
      return this.reduceTool(state, action)
    }
  }
}
