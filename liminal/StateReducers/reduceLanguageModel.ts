import type { StateReducers } from "./StateReducers.js"

export const reduceLanguageModel: StateReducers["reduceLanguageModel"] = (state, action) => {
  state.handler({
    type: "LanguageModel",
    key: action.key,
  })
  return {
    ...state,
    languageModelKey: action.key,
    next: undefined,
  }
}
