import type { Tool } from "../Action/Tool.js"
import { unwrapDeferred } from "../liminal_util/unwrapDeferred.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceScope: StateReducers["reduceScope"] = async function (state, action) {
  const { result } = await this.reduceState({
    config: state.config,
    source: action,
    agent: unwrapDeferred(action.implementation),
    languageModelKey: state.languageModelKey,
    embeddingModelKey: state.embeddingModelKey,
    system: state.system,
    next: undefined,
    parent: state,
    handler: (event) =>
      state.handler({
        type: "Scope",
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
