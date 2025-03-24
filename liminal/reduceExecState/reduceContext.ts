import { Assistant } from "../Action/Assistant.js"
import type { Tool } from "../Action/Tool.js"
import { unwrapDeferred } from "../liminal_util/unwrapDeferred.js"
import type { ActionReducers } from "./ActionReducers.js"
import { reduce } from "./reduceExecState.js"

export const reduceContext: ActionReducers["reduceContext"] = function (state, action) {
  return reduce(this, {
    models: state.models,
    source: action,
    agent: unwrapDeferred(action).implementation?.() ?? Assistant(),
    modelKey: state.modelKey,
    system: state.system,
    next: undefined,
    parent: state,
    handler: (event) =>
      state.handler({
        type: "Context",
        context: action.key,
        event,
        system: action.system,
      }),
    messages: [],
    tools: new Set<Tool>(),
  })
}
