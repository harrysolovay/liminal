import { Generation } from "../Action/Generation.js"
import type { Tool } from "../Action/Tool.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceContext: StateReducers["reduceContext"] = async function (state, action) {
  const { result } = await this.reduceState({
    config: state.config,
    source: action,
    actor: action.implementation ? unwrapDeferred(action.implementation) : Generation(),
    languageModelKey: state.languageModelKey,
    embeddingModelKey: state.embeddingModelKey,
    system: action.system,
    next: undefined,
    parent: state,
    handler: (inner) =>
      state.handler({
        event: "Context",
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
