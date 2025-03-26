import type { Tool } from "../Action/Tool.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceScope: StateReducers["reduceScope"] = async function (state, action) {
  const { result } = await this.reduceState({
    config: state.config,
    source: action,
    actor: unwrapDeferred(action.implementation),
    languageModelKey: state.languageModelKey,
    languageModel: state.languageModel,
    embeddingModelKey: state.embeddingModelKey,
    embeddingModel: state.embeddingModel,
    system: state.system,
    next: undefined,
    parent: state,
    handler: (inner) =>
      state.handler({
        event: "Scope",
        key: action.key,
        inner,
      }),
    messages: [],
    tools: new Set<Tool>(),
  })
  return {
    ...state,
    next: result,
  }
}
