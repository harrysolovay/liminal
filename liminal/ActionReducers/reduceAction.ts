import type { Action } from "../Action/Action.js"
import type { ExecState } from "../ExecState.js"
import type { ActionReducers } from "./ActionReducers.js"

export function reduceAction(reducers: ActionReducers, state: ExecState, action: Action) {
  if (!action) {
    return {
      ...state,
      next: undefined,
    }
  } else if (typeof action === "string") {
    return reducers.reduceUserText(state, action)
  } else if (Array.isArray(action)) {
    return reducers.reduceUserTexts(state, action)
  }
  switch (action.kind) {
    case "Assistant": {
      return reducers.reduceAssistant(state, action)
    }
    case "Branch": {
      return reducers.reduceBranch(state, action)
    }
    case "Context": {
      return reducers.reduceContext(state, action)
    }
    case "DisableTool": {
      return reducers.reduceDisableTool(state, action)
    }
    case "Emit": {
      return reducers.reduceEmit(state, action)
    }
    case "Messages": {
      return reducers.reduceMessages(state, action)
    }
    case "Model": {
      return reducers.reduceModel(state, action)
    }
    case "Tool": {
      return reducers.reduceTool(state, action)
    }
  }
}
