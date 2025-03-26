import type { StateReducers } from "./StateReducers.js"

export const reduceModel: StateReducers["reduceModel"] = (state, action) => {
  state.handler({
    type: "Model",
    key: action.key,
    capability: action.capability,
  })
  return {
    ...state,
    embeddingModelKey: action.key,
    next: undefined,
  }
}
