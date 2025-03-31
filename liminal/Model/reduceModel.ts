import type { ActionReducer } from "../Action/ActionReducer.js"
import type { Model } from "../Model/Model.js"

export const reduceModel: ActionReducer<Model> = (scope, action) => {
  scope.events.emit({
    type: "Model",
    key: action.key,
    purpose: action.purpose,
  })
  return scope.spread({
    next: undefined,
    model: {
      ...scope.model,
      ...(action.purpose === "language"
        ? {
          language: action.key,
        }
        : {
          embedding: action.key,
        }),
    },
  })
}
