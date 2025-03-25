import { T } from "../Action/T.js"
import type { Tool } from "../Action/Tool.js"
import { unwrapDeferred } from "../liminal_util/unwrapDeferred.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceContext: StateReducers["reduceContext"] = async function (state, action) {
  const { result } = await this.reduceState({
    models: state.models,
    source: action,
    agent: unwrapDeferred(action).implementation?.() ?? T(),
    modelKey: state.modelKey,
    system: action.system,
    next: undefined,
    parent: state,
    handler: (event) =>
      state.handler({
        type: "Context",
        key: action.key,
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
