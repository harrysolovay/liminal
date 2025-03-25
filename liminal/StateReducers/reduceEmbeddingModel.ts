import type { StateReducers } from "./StateReducers.js"

export const reduceEmbeddingModel: StateReducers["reduceEmbeddingModel"] = (state, action) => {
  state.handler({
    type: "EmbeddingModel",
    key: action.key,
  })
  return {
    ...state,
    embeddingModelKey: action.key,
    next: undefined,
  }
}
