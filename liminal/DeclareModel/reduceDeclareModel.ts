import type { ActionReducer } from "../Action/ActionReducer.js"
import type { DeclareModel } from "./DeclareModel.js"

export const reduceDeclareModel: ActionReducer<DeclareModel> = (scope, action) => {
  scope.events.emit({
    type: "model_declared",
    key: action.key,
    purpose: action.purpose,
  })
  return scope.spread({
    next: undefined,
    model: {
      ...scope.model,
      ...(action.purpose === "language"
        ? { language: action.key }
        : { embedding: action.key }),
    },
  })
}
