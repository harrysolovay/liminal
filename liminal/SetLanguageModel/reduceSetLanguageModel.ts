import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { SetLanguageModel } from "../SetLanguageModel/SetLanguageModel.ts"

export const reduceSetLanguageModel: ActionReducer<SetLanguageModel> = (action, scope) => {
  scope.events.emit({
    type: "language_model_set",
    key: action.key,
  })
  return scope.spread({
    next: undefined,
    infer: action.runInfer,
  })
}
