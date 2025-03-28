import type { StateReducers } from "./StateReducers.js"

export const reduceModel: StateReducers["reduceModel"] = (state, action) => {
  state.handler({
    event: "Model",
    key: action.key,
    purpose: action.purpose,
  })
  return {
    ...state,
    next: undefined,
    ...(action.purpose === "language"
      ? {
          languageModelKey: action.key,
        }
      : {
          embeddingModelKey: action.key,
        }),
  }
}
