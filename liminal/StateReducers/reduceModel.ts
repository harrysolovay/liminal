import type { StateReducers } from "./StateReducers.js"

export const reduceModel: StateReducers["reduceModel"] = (state, action) => {
  state.events.emit({
    event: "Model",
    key: action.key,
    purpose: action.purpose,
  })
  return {
    ...state,
    next: undefined,
    model: {
      ...state.model,
      ...(action.purpose === "language"
        ? {
            language: action.key,
          }
        : {
            embedding: action.key,
          }),
    },
  }
}
