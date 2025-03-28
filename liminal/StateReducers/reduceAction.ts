import type { ActionLike } from "../Action/Action.js"
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
    return this.reduceMessage(state, action)
  } else if ("role" in action) {
    return this.reduceMessage(state, action)
  } else if (Array.isArray(action)) {
    return this.reduceMessages(state, action)
  }
  switch (action.action) {
    case "Generation": {
      assert(state.languageModelKey)
      const reduceGeneration = state.config.models.language?.[state.languageModelKey]
      assert(reduceGeneration)
      return reduceGeneration.call(this, state, action)
    }
    case "Embedding": {
      assert(state.embeddingModelKey)
      const reduceEmbedding = state.config.models.embedding?.[state.embeddingModelKey]
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
