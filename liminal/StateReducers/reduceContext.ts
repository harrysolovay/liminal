import { Generation } from "../Action/Generation.js"
import type { Tool } from "../Action/Tool.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceContext: StateReducers["reduceContext"] = async function (state, action) {
  const { result } = await this.reduceState({
    config: state.config,
    source: action,
    actor: unwrapDeferred(action.implementation),
    languageModelKey: state.languageModelKey,
    embeddingModelKey: state.embeddingModelKey,
    system: action.system,
    next: undefined,
    parent: state,
    handler: (event) =>
      state.handler({
        type: "Context",
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
