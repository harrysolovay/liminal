import type { Action } from "../Action/Action.js"
import type { ExecState } from "../ExecState.js"
import type { StateReducers } from "./StateReducers.js"

export function reduceAction(this: StateReducers, state: ExecState, action: Action) {
  if (!action) {
    return {
      ...state,
      next: undefined,
    }
  } else if (typeof action === "string") {
    return this.reduceUserText(state, action)
  } else if (Array.isArray(action)) {
    return this.reduceUserTexts(state, action)
  }
  switch (action.kind) {
    case "UserMessage": {
      if (typeof action.text === "string") {
        return this.reduceUserText(state, action.text)
      }
      return this.reduceUserTexts(state, action.text)
    }
    case "Generation": {
      return this.reduceGeneration(state, action)
    }
    case "Scope": {
      return this.reduceScope(state, action)
    }
    case "Embedding": {
      return this.reduceEmbedding(state, action)
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
    case "Messages": {
      return this.reduceMessages(state, action)
    }
    case "Model": {
      return this.reduceModel(state, action)
    }
    case "Tool": {
      return this.reduceTool(state, action)
    }
  }
}
