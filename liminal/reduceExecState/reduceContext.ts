import { Completion } from "../Action/Assistant.js"
import type { Tool } from "../Action/Tool.js"
import { unwrapDeferred } from "../liminal_util/unwrapDeferred.js"
import type { ActionReducers } from "./ActionReducers.js"
import { reduceExecState } from "./reduceExecState.js"

export const reduceContext: ActionReducers["reduceContext"] = async function (state, action) {
  const { result } = await reduceExecState(this, {
    models: state.models,
    source: action,
    agent: unwrapDeferred(action).implementation?.() ?? Completion(),
    modelKey: state.modelKey,
    system: state.system,
    next: undefined,
    parent: state,
    handler: (event) =>
      state.handler({
        type: "Context",
        context: action.key,
        event,
      }),
    messages: [],
    tools: new Set<Tool>(),
  })
  return {
    ...state,
    next: result,
  }
}
