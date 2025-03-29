import type { ActionReducer } from "../Action/ActionReducer.js"
import type { Model } from "../Model/Model.js"

export const reduceModel: ActionReducer<Model> = (state, action) => {
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
